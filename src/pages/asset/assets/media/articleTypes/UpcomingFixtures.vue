<template>
  <div class="pa-4 text-body" :id="copyID">
    <!-- Article View (default) -->
    <div>
      <div class="mb-4 d-flex align-center flex-wrap">
        <!-- Locked state: Show lock icon and label -->
        <template v-if="isLocked">
          <v-icon color="warning" size="small">mdi-lock</v-icon>
          <span class="text-caption ml-2">Article Locked</span>
        </template>

        <!-- Normal state: Show buttons -->
        <template v-else>
          <div class="d-flex align-center justify-space-between w-100" style="gap: 8px;">
            <IconButton icon="mdi-file-document-edit" :tooltip="buttonText" size="small" color="primary"
              :loading="isPending" :disabled="isPending" @click="showConfirmationDialog = true" />
            <div class="d-flex align-center ms-auto" style="gap: 8px;">
              <!-- Additional buttons shown when article is written -->
              <template v-if="showAdditionalButtons">
                <v-tooltip v-if="hasContext" location="top">
                  <template v-slot:activator="{ props }">
                    <v-chip v-bind="props" color="orange" size="small" variant="tonal">
                      <v-icon start size="x-small">mdi-check-circle</v-icon>
                      Context
                    </v-chip>
                  </template>
                  <span>Context has been added to this article</span>
                </v-tooltip>
                <IconButton icon="mdi-text-box-plus" tooltip="Add Context" size="small" color="success"
                  :loading="isPending" :disabled="isPending" @click="onAddContext" />
              </template>
            </div>
          </div>
        </template>

        <div v-if="requestError" class="ml-3 text-error">{{ requestError }}</div>
      </div>

      <!-- Confirmation Dialog -->
      <ConfirmationModal v-model="showConfirmationDialog" :title="`Confirm ${buttonText}`" :persistent="isPending"
        :loading="isPending" :disabled="isPending" @confirm="confirmAndRequest">
        <p v-if="articlePhase === 'initial' || articlePhase === 'postPending'">
          Are you sure you want to request a new AI Upcoming Fixtures article? This will generate a fresh article
          based on the current data.
        </p>
        <p v-else-if="articlePhase === 'articleWritten'">
          Are you sure you want to request a review? This will generate a new version of the article based on your
          feedback.
        </p>
        <p v-else>
          Are you sure you want to proceed with this request?
        </p>
      </ConfirmationModal>

      <!-- Context Dialog -->
      <ContextDialog v-model="showContextDialog" v-model:contextText="contextText" :hasContext="hasContext"
        :isSaving="isSavingContext" :error="contextError" :success="contextSuccess" :maxLength="CONTEXT_MAX_LENGTH"
        :charCount="contextCharCount" :charRemaining="contextCharRemaining" :charCountClass="contextCharCountClass"
        :isValid="isContextValid" :cancelLabel="cancelButtonLabel" @save="handleSaveContext"
        @delete="handleDeleteContext" @close="closeContextDialog" />

      <!-- Article Display -->
      <UpcomingFixturesDisplay :articleStatus="articleStatus" :formattedArticles="formattedArticles"
        :isRequesting="isPending" :isLocked="isLocked" @request-writeup="showConfirmationDialog = true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineExpose, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  pollWeekendArticleStatus,
  triggerWeekendArticleAction,
} from "@/store/aiArticles/actions";
import { useArticleFeedback } from "@/composables/aiArticles/useArticleFeedback";
import { useArticleStatus } from "@/composables/aiArticles/useArticleStatus";
import { useArticlePolling } from "@/composables/aiArticles/useArticlePolling";
import { FlattenedArticle } from "@/types/ArticleTypes";
import { useUpcomingFixturesFormatting } from "./_composables/useUpcomingFixturesFormatting";
import { useArticleContext } from "./_composables/useArticleContext";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import ConfirmationModal from "@/components/primitives/modals/ConfirmationModal.vue";
import ContextDialog from "./_components/ContextDialog.vue";
import UpcomingFixturesDisplay from "./_components/UpcomingFixturesDisplay.vue";

// Define the props
const props = defineProps<{
  articles: FlattenedArticle[];
  copyID?: string;
  accountId?: number;
  renderId?: number;
}>();

const route = useRoute();
const router = useRouter();

// Function to trigger data sync on render (refresh page data)
function triggerDataSync() {
  router.go(0); // Reload current page
}

// Initialize UpcomingFixtures formatting composable
const articlesRef = computed(() => props.articles);
const {
  formattedArticles,
  hasArticle,
  copyArticle: copyArticleFromComposable,
} = useUpcomingFixturesFormatting(articlesRef);

// Display helpers
const accountIdDisplay = computed<number | null>(() => {
  const first = props.articles?.[0];
  if (first && typeof (first as FlattenedArticle & { accountId?: number }).accountId === "number") {
    const accountId = (first as FlattenedArticle & { accountId?: number }).accountId;
    return accountId ?? null;
  }
  const fromRoute = Number(route.params.accountid);
  return Number.isFinite(fromRoute) ? fromRoute : null;
});

const renderIdDisplay = computed<number | null>(() => {
  const fromRoute = Number(route.params.renderid);
  return Number.isFinite(fromRoute) ? fromRoute : null;
});

// copyArticle is now provided by useUpcomingFixturesFormatting composable
const copyArticle = copyArticleFromComposable;

// Expose the copyArticle method to the parent
defineExpose({
  copyArticle,
});

// Initialize composables
const { feedbackCount, isLocked, updateFeedback } = useArticleFeedback();
const { articleStatus, articlePhase } = useArticleStatus(hasArticle, feedbackCount);
const { startPolling, stopPolling } = useArticlePolling();

// Component state
const isPending = ref(false);
const requestError = ref("");
const triggerResponse = ref<unknown>(null);
const showConfirmationDialog = ref(false);

// Initialize article context composable
const {
  showContextDialog,
  contextText,
  isSavingContext,
  contextError,
  contextSuccess,
  hasContext,
  CONTEXT_MAX_LENGTH,
  contextCharCount,
  contextCharRemaining,
  isContextValid,
  contextCharCountClass,
  cancelButtonLabel,
  onAddContext,
  fetchExistingContext,
  closeContextDialog,
  handleSaveContext,
  handleDeleteContext,
} = useArticleContext(
  () => accountIdDisplay.value,
  () => renderIdDisplay.value,
  () => resolvedArticleId.value
);

// Button text based on phase
const buttonText = computed(() => {
  const phase = articlePhase.value;
  const status = articleStatus.value;

  if (phase === "pending") {
    if (status === "writing") return "Writing…";
    if (status === "pending") return "Pending…";
    return "Processing…";
  }

  if (phase === "articleWritten") {
    return "Request a Review";
  }

  // Initial or postPending
  return "Request Write-up";
});

// Show additional buttons (Add Context) whenever article is NOT locked
const showAdditionalButtons = computed(() => {
  return !isLocked.value;
});

// Watch articleStatus and handle state changes
watch(articleStatus, (newStatus, oldStatus) => {
  // Detect transition from pending to completed for data sync
  if (oldStatus === "pending" && newStatus === "completed") {
    triggerDataSync();
  }

  // Only set isPending for actual polling state (pending only)
  isPending.value = newStatus === "pending";

  // Stop polling if status is NOT pending
  if (newStatus !== "pending") {
    stopPolling();
  }
});

// Resolve IDs for trigger payload
const resolvedArticleId = computed<number | null>(() => {
  const first = props.articles?.[0];
  return first?.id ?? null;
});

// Confirmation dialog handler
function confirmAndRequest() {
  showConfirmationDialog.value = false;
  onRequestWriteup();
}

async function onRequestWriteup() {
  try {
    requestError.value = "";
    triggerResponse.value = null;
    isPending.value = true;

    const accountId = accountIdDisplay.value;
    const renderId = renderIdDisplay.value;
    const articleId = resolvedArticleId.value;

    if (
      typeof accountId !== "number" ||
      typeof renderId !== "number" ||
      typeof articleId !== "number"
    ) {
      throw new Error("Missing required identifiers (accountId, renderId, articleId)");
    }

    // Capture and display the trigger response
    // Note: Using weekend article action for now - replace with UpcomingFixtures-specific action when available
    const response = await triggerWeekendArticleAction({ accountId, renderId, articleId });
    triggerResponse.value = response;

    // Check status endpoint to determine if polling is needed
    const statusRes = await pollWeekendArticleStatus({ accountId, renderId, articleId });

    if (statusRes.data) {
      const status = statusRes.data.status;

      // Update feedback from response
      updateFeedback(statusRes.data);

      // Only start polling if status is pending
      if (status === "pending") {
        startPolling(
          { accountId, renderId, articleId },
          (data) => {
            // Update feedback on each poll
            updateFeedback(data);
          },
          () => {
            // On complete - data sync will be handled by watcher
          },
          (error) => {
            requestError.value = error;
            isPending.value = false;
          }
        );
      } else {
        // Status is already completed/failed, don't poll
        isPending.value = false;
        if (status === "failed") {
          requestError.value = statusRes.data.locked
            ? "Article is locked (feedback limit reached or article too old)"
            : "Article generation failed";
        }
      }
    }
  } catch (e: unknown) {
    const error = e as Error;
    requestError.value = error?.message || "Unable to trigger write-up";
    isPending.value = false;
  }
}

// Check status on mount and resume polling if needed
onMounted(async () => {
  const accountId = accountIdDisplay.value;
  const renderId = renderIdDisplay.value;
  const articleId = resolvedArticleId.value;

  if (
    typeof accountId !== "number" ||
    typeof renderId !== "number" ||
    typeof articleId !== "number"
  ) {
    return; // Can't check status without IDs
  }

  try {
    // Check current status
    const statusRes = await pollWeekendArticleStatus({ accountId, renderId, articleId });

    if (statusRes.data) {
      const status = statusRes.data.status;

      // Update feedback from response
      updateFeedback(statusRes.data);

      // If pending, automatically start polling
      if (status === "pending") {
        isPending.value = true;
        startPolling(
          { accountId, renderId, articleId },
          (data) => {
            // Update feedback on each poll
            updateFeedback(data);
          },
          () => {
            // On complete - data sync will be handled by watcher
          },
          (error) => {
            requestError.value = error;
            isPending.value = false;
          }
        );
      } else if (status === "failed") {
        // Article failed, show error
        if (statusRes.data.locked) {
          requestError.value = "Article is locked (feedback limit reached or article too old)";
        } else {
          requestError.value = "Article generation failed";
        }
      }
    }

    // Fetch existing context if article exists
    if (articleId) {
      await fetchExistingContext();
    }
  } catch (e: unknown) {
    // Silently fail on mount - don't show error unless user triggers
    console.warn("Failed to check article status on mount:", e);
  }
});
</script>

<style scoped>
/* Any specific styling can be added here */
</style>
