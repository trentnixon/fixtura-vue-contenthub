<template>
  <div class="pa-4 text-body" :id="copyID">
    <!-- Article View (default) -->
    <div>
      <div class="mb-4 d-flex align-center flex-wrap">
        <!-- Locked state: Show lock icon and label -->
        <template v-if="isLocked">
          <v-icon color="warning" size="small">mdi-lock</v-icon>
          <span class="text-caption ml-2">{{
            PRESSBOX_COPY.locked.label
          }}</span>
        </template>

        <!-- Normal state: Show buttons -->
        <template v-else>
          <div
            class="d-flex align-center justify-space-between w-100"
            style="gap: 8px"
          >
            <IconButton
              icon="mdi-file-document-edit"
              :tooltip="rewriteDisabledTooltip || buttonText"
              size="small"
              color="primary"
              :loading="isPending"
              :disabled="
                isPending ||
                (articlePhase === 'articleWritten' && !canRequestReview)
              "
              @click="showConfirmationDialog = true"
            />
            <div class="d-flex align-center ms-auto" style="gap: 8px">
              <!-- Additional buttons shown when article is written -->
              <template v-if="showAdditionalButtons">
                <v-tooltip v-if="hasContext" location="top">
                  <template v-slot:activator="{ props }">
                    <v-chip
                      v-bind="props"
                      color="orange"
                      size="small"
                      variant="tonal"
                    >
                      <v-icon start size="x-small">mdi-check-circle</v-icon>
                      Context
                    </v-chip>
                  </template>
                  <span>{{ PRESSBOX_COPY.context.addedTooltip }}</span>
                </v-tooltip>
                <IconButton
                  icon="mdi-text-box-plus"
                  tooltip="Add Context"
                  size="small"
                  color="success"
                  :loading="isPending"
                  :disabled="isPending"
                  @click="onAddContext"
                />
              </template>
            </div>
          </div>
        </template>

        <div
          v-if="
            requestError && articleStatus !== 'failed' && !isPollingTimedOut
          "
          class="ml-3 text-error"
        >
          {{ requestError }}
        </div>
      </div>

      <!-- Confirmation Dialog -->
      <PressboxConfirmationModal
        v-model="showConfirmationDialog"
        :title="buttonText"
        :subhead="confirmationCopy.subhead"
        :description="confirmationCopy.description"
        :confirm-label="buttonText"
        :persistent="isPending"
        :loading="isPending"
        :disabled="isPending"
        @confirm="confirmAndRequest"
      />

      <!-- Context Dialog -->
      <ContextDialog
        v-model="showContextDialog"
        v-model:contextText="contextText"
        :hasContext="hasContext"
        :isSaving="isSavingContext"
        :error="contextError"
        :success="contextSuccess"
        :maxLength="CONTEXT_MAX_LENGTH"
        :charCount="contextCharCount"
        :charRemaining="contextCharRemaining"
        :charCountClass="contextCharCountClass"
        :isValid="isContextValid"
        :cancelLabel="cancelButtonLabel"
        @save="handleSaveContext"
        @delete="handleDeleteContext"
        @close="closeContextDialog"
      />

      <!-- Article Display -->
      <LadderDisplay
        :articleStatus="articleStatus"
        :formattedArticles="formattedArticles"
        :isRequesting="isPending"
        :isLocked="isLocked"
        :is-polling-timed-out="isPollingTimedOut"
        :is-checking-status="isCheckingStatus"
        :detail-message="requestError || undefined"
        @request-writeup="showConfirmationDialog = true"
        @check-status="void checkGenerationStatus()"
        @keep-waiting="keepWaitingForGeneration()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useArticleFeedback } from "@/composables/aiArticles/useArticleFeedback";
import { useArticleStatus } from "@/composables/aiArticles/useArticleStatus";
import { useArticleGenerationLifecycle } from "@/composables/aiArticles/useArticleGenerationLifecycle";
import {
  getPressboxButtonText,
  PRESSBOX_COPY,
  resolvePressboxConfirmationCopy,
} from "@/constants/pressboxCopy";
import { useArticleTriggerFlow } from "@/composables/aiArticles/useArticleTriggerFlow";
import { FlattenedArticle } from "@/types/ArticleTypes";
import { useLadderFormatting } from "./_composables/useLadderFormatting";
import { useArticleContext } from "./_composables/useArticleContext";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import PressboxConfirmationModal from "./_components/PressboxConfirmationModal.vue";
import ContextDialog from "./_components/ContextDialog.vue";
import LadderDisplay from "./_components/LadderDisplay.vue";

// Define the props
const props = defineProps<{
  articles: FlattenedArticle[];
  copyID?: string;
  accountId?: number;
  renderId?: number;
}>();

const route = useRoute();

// Initialize Ladder formatting composable
const articlesRef = computed(() => props.articles);
const { formattedArticles, copyArticle: copyArticleFromComposable } =
  useLadderFormatting(articlesRef);

// Match LadderDisplay: a CMS article row alone is not a completed writeup.
const hasValidContent = computed(() => {
  return formattedArticles.value.some(
    (article) => article.leagues && article.leagues.length > 0
  );
});

// Display helpers
const accountIdDisplay = computed<number | null>(() => {
  const first = props.articles?.[0];
  if (
    first &&
    typeof (first as FlattenedArticle & { accountId?: number }).accountId ===
      "number"
  ) {
    const accountId = (first as FlattenedArticle & { accountId?: number })
      .accountId;
    return accountId ?? null;
  }
  const fromRoute = Number(route.params.accountid);
  return Number.isFinite(fromRoute) ? fromRoute : null;
});

const renderIdDisplay = computed<number | null>(() => {
  const fromRoute = Number(route.params.renderid);
  return Number.isFinite(fromRoute) ? fromRoute : null;
});

// copyArticle is now provided by useLadderFormatting composable
const copyArticle = copyArticleFromComposable;

// Expose the copyArticle method to the parent
defineExpose({
  copyArticle,
});

// Initialize composables
const { feedbackCount, isLocked, updateFeedback } = useArticleFeedback();
const { articleStatus, articlePhase } = useArticleStatus(
  hasValidContent,
  feedbackCount
);

const resolvedArticleId = computed<number | null>(() => {
  const first = props.articles?.[0];
  return first?.id ?? null;
});

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

const isPending = ref(false);
const showConfirmationDialog = ref(false);
const requestError = ref("");

const {
  isPollingTimedOut,
  isCheckingStatus,
  startGenerationPolling,
  checkGenerationStatus,
  keepWaitingForGeneration,
} = useArticleGenerationLifecycle({
  accountId: () => accountIdDisplay.value,
  renderId: () => renderIdDisplay.value,
  articleId: () => resolvedArticleId.value,
  articleStatus,
  isPending,
  updateFeedback,
  requestError,
  onMountComplete: fetchExistingContext,
});

const { canRequestReview, rewriteDisabledTooltip, executeArticleTrigger } =
  useArticleTriggerFlow({
    accountId: () => accountIdDisplay.value,
    renderId: () => renderIdDisplay.value,
    articleId: () => resolvedArticleId.value,
    articlePhase,
    articleStatus,
    hasContext,
    isLocked,
    isPending,
    updateFeedback,
    requestError,
    startGenerationPolling,
  });

// Button text based on phase
const buttonText = computed(() =>
  getPressboxButtonText(articlePhase.value, articleStatus.value)
);

const confirmationCopy = computed(() =>
  resolvePressboxConfirmationCopy("ladder", articlePhase.value)
);

const showAdditionalButtons = computed(() => {
  return !isLocked.value && hasValidContent.value;
});

function confirmAndRequest() {
  showConfirmationDialog.value = false;
  void executeArticleTrigger();
}
</script>

<style scoped>
/* Any specific styling can be added here */
</style>
