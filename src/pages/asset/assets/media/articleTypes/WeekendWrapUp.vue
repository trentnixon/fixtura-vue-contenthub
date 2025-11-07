<template>
  <div class="pa-4 text-body" :id="copyID">
    <!-- Fixture Edit View -->
    <div v-if="isEditingFixtures">
      <!-- Fixture Edit Form (when editing a specific fixture) -->
      <FixtureEditForm v-if="editingFixtureIndex !== null && editingFixture && editingFixtureData"
        :editingFixtureIndex="editingFixtureIndex" :editingFixtureData="editingFixtureData"
        :expandedSections="expandedSections" :error="fixtureError" :hasChanges="hasEditingChanges"
        ref="fixtureFormRefComponent" @save="handleSaveFixture" @cancel="onCancelEdit"
        @update:expandedSections="expandedSections = $event">
        <AccountBiasSection :accountBias="editingFixtureData.accountBias"
          @update:accountBias="editingFixtureData.accountBias = $event" />

        <MatchContextSection :matchContext="editingFixtureData.matchContext"
          :validationRules="{ requiredRule, dateRule }"
          @update:matchContext="editingFixtureData.matchContext = $event" />

        <TeamSection :team="editingFixtureData.homeTeam" teamType="homeTeam" :validationRules="{ requiredRule }"
          @update:team="editingFixtureData.homeTeam = $event"
          @add-player="(inningIndex) => addPlayer('homeTeam', inningIndex)"
          @remove-player="(inningIndex, playerIndex) => removePlayer('homeTeam', inningIndex, playerIndex)"
          @add-bowler="(inningIndex) => addBowler('homeTeam', inningIndex)"
          @remove-bowler="(inningIndex, bowlerIndex) => removeBowler('homeTeam', inningIndex, bowlerIndex)"
          @add-fielder="(inningIndex) => addFielder('homeTeam', inningIndex)"
          @remove-fielder="(inningIndex, fielderIndex) => removeFielder('homeTeam', inningIndex, fielderIndex)" />

        <TeamSection :team="editingFixtureData.awayTeam" teamType="awayTeam" :validationRules="{ requiredRule }"
          @update:team="editingFixtureData.awayTeam = $event"
          @add-player="(inningIndex) => addPlayer('awayTeam', inningIndex)"
          @remove-player="(inningIndex, playerIndex) => removePlayer('awayTeam', inningIndex, playerIndex)"
          @add-bowler="(inningIndex) => addBowler('awayTeam', inningIndex)"
          @remove-bowler="(inningIndex, bowlerIndex) => removeBowler('awayTeam', inningIndex, bowlerIndex)"
          @add-fielder="(inningIndex) => addFielder('awayTeam', inningIndex)"
          @remove-fielder="(inningIndex, fielderIndex) => removeFielder('awayTeam', inningIndex, fielderIndex)" />
      </FixtureEditForm>

      <!-- Fixture List View (when not editing) -->
      <div v-else>
        <!-- Header with navigation -->
        <div class="mb-4 d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <IconButton icon="mdi-arrow-left" tooltip="Back to Article" size="small" color="error"
              @click="onBackToArticle" />
          </div>
          <div class="d-flex align-center">
            <IconButton icon="mdi-content-save-all" tooltip="Save all changes to fixtures" size="small"
              :color="hasUnsavedChanges ? 'success' : 'grey'" :loading="isSavingFixtures"
              :disabled="!hasUnsavedChanges || isSavingFixtures" @click="onSaveAllChanges" />
          </div>
        </div>

        <!-- Error message -->
        <div v-if="fixtureError" class="mb-4 pa-3 bg-error-lighten-5 rounded text-error">
          {{ fixtureError }}
        </div>
        <!-- Title -->
        <div class="mb-4">
          <h2 class="text-title">Edit Fixtures</h2>
          <div v-if="fixtureCount > 0" class="text-caption text-grey mt-1">
            {{ fixtureCount }} {{ fixtureCount === 1 ? 'fixture' : 'fixtures' }}
          </div>
        </div>
        <!-- Search Controls -->
        <SearchSortControls v-model:searchQuery="searchQuery" :filteredCount="filteredAndSortedFixtures.length"
          :totalCount="fixtureCount" />



        <!-- Fixture List -->
        <FixtureList :fixtures="fixtures" :filteredAndSortedFixtures="filteredAndSortedFixtures"
          :unsavedChanges="unsavedChanges" :error="fixtureError" :getFixtureSummary="getFixtureSummary"
          @edit-fixture="onEditFixture" />
      </div>
    </div>

    <!-- Article View (default) -->
    <div v-else>
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
                <IconButton icon="mdi-pencil-box" tooltip="Edit Fixtures" size="small" color="success"
                  :loading="isPending" :disabled="isPending" @click="onMakeEditToFixture" />
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
          Are you sure you want to request a new AI write-up? This will generate a fresh article based on the current
          data.
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

      <!-- Debug: Show trigger response -->
      <div v-if="false && triggerResponse" class="mb-4 pa-3 bg-grey-lighten-4 rounded">
        <div class="text-caption font-weight-bold mb-2">Trigger Response:</div>
        <pre class="text-caption" style="white-space: pre-wrap; word-break: break-all;">{{ JSON.stringify(triggerResponse,
          null, 2) }}</pre>
      </div>

      <!-- Debug: Polling status -->
      <div v-if="false" class="mb-4 pa-3 bg-blue-lighten-5 rounded">
        <div class="text-caption font-weight-bold mb-2">Polling Debug:</div>
        <div class="text-caption">
          <div>Article Status: <strong>{{ articleStatus }}</strong></div>
          <div>Phase: <strong>{{ articlePhase }}</strong></div>
          <div>Feedback Count: <strong>{{ feedbackCount }}</strong> / Limit: <strong>{{ feedbackLimit }}</strong></div>
          <div>Locked: <span :class="isLocked ? 'text-warning' : 'text-success'">{{ isLocked ? 'Yes' : 'No' }}</span>
          </div>
          <div>Polling: <span :class="isPollingActiveComputed ? 'text-success' : 'text-grey'">{{ pollingStatusText
          }}</span>
          </div>
          <div>Poll Count: <strong>{{ pollCount }}</strong></div>
          <div v-if="isPollingActiveComputed">Next poll in: ~5s</div>
        </div>
      </div>

      <!-- Article Display -->
      <ArticleDisplay :articleStatus="articleStatus" :formattedArticles="formattedArticles"
        :isFirstResultForArticle="isFirstResultForArticle" :formatPromptData="formatPromptData"
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
import { useFixtureEditing } from "./_composables/useFixtureEditing";
import { useArticleContext } from "./_composables/useArticleContext";
import { useFixtureValidation } from "./_composables/useFixtureValidation";
import { useFixtureSearchSort } from "./_composables/useFixtureSearchSort";
import { useArticleFormatting } from "./_composables/useArticleFormatting";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import ConfirmationModal from "@/components/primitives/modals/ConfirmationModal.vue";
import SearchSortControls from "./_components/SearchSortControls.vue";
import ContextDialog from "./_components/ContextDialog.vue";
import FixtureList from "./_components/FixtureList.vue";
import ArticleDisplay from "./_components/ArticleDisplay.vue";
import MatchContextSection from "./_components/MatchContextSection.vue";
import AccountBiasSection from "./_components/AccountBiasSection.vue";
import TeamSection from "./_components/TeamSection.vue";
import FixtureEditForm from "./_components/FixtureEditForm.vue";

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
  // Refresh the current route to reload render data
  // This will fetch fresh article data from the server
  router.go(0); // Reload current page
  // Alternative: Could emit an event for parent to handle refresh
  // emit('refresh-data');
}

// Initialize article formatting composable
const articlesRef = computed(() => props.articles);
const {
  formattedArticles,
  hasArticle,
  isFirstResultForArticle,
  formatPromptData,
  copyArticle: copyArticleFromComposable,
} = useArticleFormatting(articlesRef);

// Display helpers
const accountIdDisplay = computed<number | null>(() => {
  const first = props.articles?.[0];
  if (first && typeof (first as any).accountId === "number") return (first as any).accountId;
  const fromRoute = Number(route.params.accountid);
  return Number.isFinite(fromRoute) ? fromRoute : null;
});

const renderIdDisplay = computed<number | null>(() => {
  const fromRoute = Number(route.params.renderid);
  return Number.isFinite(fromRoute) ? fromRoute : null;
});


// copyArticle is now provided by useArticleFormatting composable
const copyArticle = copyArticleFromComposable;

// Expose the copyArticle method to the parent
defineExpose({
  copyArticle,
});

// Initialize composables
const { feedbackCount, feedbackLimit, isLocked, updateFeedback } = useArticleFeedback();
const { articleStatus, articlePhase } = useArticleStatus(hasArticle, feedbackCount);
const { pollCount, isPollingActive, startPolling, stopPolling } = useArticlePolling();

// Component state
const isPending = ref(false);
const requestError = ref("");
const triggerResponse = ref<any>(null);
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

// Initialize fixture editing composable
const {
  isEditingFixtures,
  fixtures,
  editingFixtureIndex,
  editingFixture,
  unsavedChanges,
  isSavingFixtures,
  fixtureError,
  expandedSections,
  hasUnsavedChanges,
  hasEditingChanges,
  fixtureCount,
  editingFixtureData,
  onMakeEditToFixture,
  onBackToArticle,
  onSaveAllChanges,
  onEditFixture,
  onCancelEdit,
  onSaveFixture,
  addInning,
  removeInning,
  addPlayer,
  removePlayer,
  addBowler,
  removeBowler,
  addFielder,
  removeFielder,
} = useFixtureEditing(
  articlesRef,
  () => accountIdDisplay.value,
  () => renderIdDisplay.value,
  () => resolvedArticleId.value
);

// Initialize fixture search/sort composable
const {
  searchQuery,
  sortBy,
  sortOrder,
  filteredAndSortedFixtures,
  getFixtureSummary,
} = useFixtureSearchSort(fixtures);

// Initialize fixture validation composable
const {
  requiredRule,
  dateRule,
} = useFixtureValidation();

// Form ref for validation
const fixtureFormRefComponent = ref<any>(null);

// Handler for save fixture with form validation
async function handleSaveFixture() {
  await onSaveFixture(fixtureFormRefComponent.value);
}

// Computed to check if polling is active (should only be true when status is pending AND timer is running)
const isPollingActiveComputed = computed(() => {
  const status = articleStatus.value;
  return isPollingActive.value && status === "pending";
});

// Status text for polling debug
const pollingStatusText = computed(() => {
  return isPollingActiveComputed.value ? "🟢 Active" : "⚪ Inactive";
});

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

// Show additional buttons (Add Context, Edit Fixture) whenever article is NOT locked
const showAdditionalButtons = computed(() => {
  return !isLocked.value;
});

// All computed properties are now provided by composables

// Watch articleStatus and handle state changes
watch(articleStatus, (newStatus, oldStatus) => {
  // Detect transition from pending to completed for data sync
  if (oldStatus === "pending" && newStatus === "completed") {
    // Trigger data sync to refresh render data
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
    triggerResponse.value = null; // Clear previous response
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
  } catch (e: any) {
    requestError.value = e?.message || "Unable to trigger write-up";
    isPending.value = false;
  }
}

// All context, fixture handler, and array manipulation functions are now provided by composables


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
  } catch (e: any) {
    // Silently fail on mount - don't show error unless user triggers
    console.warn("Failed to check article status on mount:", e);
  }
});
</script>
