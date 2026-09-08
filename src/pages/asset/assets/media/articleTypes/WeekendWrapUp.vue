<template>
  <div class="pa-4 text-body" :id="copyID">
    <!-- Fixture Edit View -->
    <div v-if="isEditingFixtures">
      <!-- Fixture Edit Form (when editing a specific fixture) -->
      <FixtureEditForm
        v-if="
          editingFixtureIndex !== null && editingFixture && editingFixtureData
        "
        :editingFixtureIndex="editingFixtureIndex"
        :editingFixtureData="editingFixtureData"
        :expandedSections="expandedSections"
        :error="fixtureError"
        :hasChanges="hasEditingChanges"
        ref="fixtureFormRefComponent"
        @save="handleSaveFixture"
        @cancel="onCancelEdit"
        @update:expandedSections="expandedSections = $event"
      >
        <AccountBiasSection
          v-if="editingFixtureData.accountBias"
          :accountBias="editingFixtureData.accountBias"
          @update:accountBias="editingFixtureData.accountBias = $event"
        />

        <MatchContextSection
          :matchContext="editingFixtureData.matchContext"
          :validationRules="{ requiredRule, dateRule }"
          @update:matchContext="editingFixtureData.matchContext = $event"
        />

        <TeamSection
          :team="editingFixtureData.homeTeam"
          teamType="homeTeam"
          :validationRules="{ requiredRule }"
          @update:team="editingFixtureData.homeTeam = $event"
          @add-player="(inningIndex) => addPlayer('homeTeam', inningIndex)"
          @remove-player="
            (inningIndex, playerIndex) =>
              removePlayer('homeTeam', inningIndex, playerIndex)
          "
          @add-bowler="(inningIndex) => addBowler('homeTeam', inningIndex)"
          @remove-bowler="
            (inningIndex, bowlerIndex) =>
              removeBowler('homeTeam', inningIndex, bowlerIndex)
          "
          @add-fielder="(inningIndex) => addFielder('homeTeam', inningIndex)"
          @remove-fielder="
            (inningIndex, fielderIndex) =>
              removeFielder('homeTeam', inningIndex, fielderIndex)
          "
        />

        <TeamSection
          :team="editingFixtureData.awayTeam"
          teamType="awayTeam"
          :validationRules="{ requiredRule }"
          @update:team="editingFixtureData.awayTeam = $event"
          @add-player="(inningIndex) => addPlayer('awayTeam', inningIndex)"
          @remove-player="
            (inningIndex, playerIndex) =>
              removePlayer('awayTeam', inningIndex, playerIndex)
          "
          @add-bowler="(inningIndex) => addBowler('awayTeam', inningIndex)"
          @remove-bowler="
            (inningIndex, bowlerIndex) =>
              removeBowler('awayTeam', inningIndex, bowlerIndex)
          "
          @add-fielder="(inningIndex) => addFielder('awayTeam', inningIndex)"
          @remove-fielder="
            (inningIndex, fielderIndex) =>
              removeFielder('awayTeam', inningIndex, fielderIndex)
          "
        />
      </FixtureEditForm>

      <!-- Fixture List View (when not editing) -->
      <div v-else>
        <!-- Header with navigation -->
        <div class="mb-4 d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <IconButton
              icon="mdi-arrow-left"
              :tooltip="PRESSBOX_COPY.tooltips.backToWriteup"
              size="small"
              color="error"
              @click="onBackToArticle"
            />
          </div>
          <div class="d-flex align-center">
            <IconButton
              icon="mdi-content-save-all"
              tooltip="Save all changes to fixtures"
              size="small"
              :color="hasUnsavedChanges ? 'success' : 'grey'"
              :loading="isSavingFixtures"
              :disabled="!hasUnsavedChanges || isSavingFixtures"
              @click="onSaveAllChanges"
            />
          </div>
        </div>

        <!-- Error message -->
        <div
          v-if="fixtureError"
          class="mb-4 pa-3 bg-error-lighten-5 rounded text-error"
        >
          {{ fixtureError }}
        </div>
        <!-- Title -->
        <div class="mb-4">
          <h2 class="text-title">Edit Fixtures</h2>
          <div v-if="fixtureCount > 0" class="text-caption text-grey mt-1">
            {{ fixtureCount }} {{ fixtureCount === 1 ? "fixture" : "fixtures" }}
          </div>
        </div>
        <!-- Search Controls -->
        <SearchSortControls
          v-model:searchQuery="searchQuery"
          :filteredCount="filteredAndSortedFixtures.length"
          :totalCount="fixtureCount"
        />

        <!-- Fixture List -->
        <FixtureList
          :fixtures="fixtures"
          :filteredAndSortedFixtures="filteredAndSortedFixtures"
          :unsavedChanges="unsavedChanges"
          :error="fixtureError"
          :getFixtureSummary="getFixtureSummary"
          @edit-fixture="onEditFixture"
        />
      </div>
    </div>

    <!-- Article View (default) -->
    <div v-else>
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
                <IconButton
                  icon="mdi-pencil-box"
                  tooltip="Edit Fixtures"
                  size="small"
                  color="success"
                  :loading="isPending"
                  :disabled="isPending"
                  @click="onMakeEditToFixture"
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

      <!-- Debug: Polling status -->
      <div v-if="false" class="mb-4 pa-3 bg-blue-lighten-5 rounded">
        <div class="text-caption font-weight-bold mb-2">Polling Debug:</div>
        <div class="text-caption">
          <div>
            Article Status: <strong>{{ articleStatus }}</strong>
          </div>
          <div>
            Phase: <strong>{{ articlePhase }}</strong>
          </div>
          <div>
            Feedback Count: <strong>{{ feedbackCount }}</strong> / Limit:
            <strong>{{ feedbackLimit }}</strong>
          </div>
          <div>
            Locked:
            <span :class="isLocked ? 'text-warning' : 'text-success'">{{
              isLocked ? "Yes" : "No"
            }}</span>
          </div>
          <div>
            Polling:
            <span
              :class="isPollingActiveComputed ? 'text-success' : 'text-grey'"
              >{{ pollingStatusText }}</span
            >
          </div>
          <div>
            Poll Count: <strong>{{ pollCount }}</strong>
          </div>
          <div v-if="isPollingActiveComputed">Next poll in: ~5s</div>
        </div>
      </div>

      <!-- Article Display -->
      <ArticleDisplay
        :articleStatus="articleStatus"
        :formattedArticles="formattedArticles"
        :isFirstResultForArticle="isFirstResultForArticle"
        :formatPromptData="formatPromptData"
        :isRequesting="isPending"
        :isLocked="isLocked"
        :is-polling-timed-out="isPollingTimedOut"
        :is-checking-status="isCheckingStatus"
        :detail-message="requestError || undefined"
        :articles="articles"
        :isSavingFixtures="isSavingFixtures"
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
import { refreshFullAiArticle } from "@/store/aiArticles/actions";
import { useArticleFeedback } from "@/composables/aiArticles/useArticleFeedback";
import { useArticleStatus } from "@/composables/aiArticles/useArticleStatus";
import { isArticleGenerationInFlight } from "@/constants/articleConstants";
import { useArticleGenerationLifecycle } from "@/composables/aiArticles/useArticleGenerationLifecycle";
import {
  getPressboxButtonText,
  PRESSBOX_COPY,
  resolvePressboxConfirmationCopy,
} from "@/constants/pressboxCopy";
import { useArticleTriggerFlow } from "@/composables/aiArticles/useArticleTriggerFlow";
import { FlattenedArticle } from "@/types/ArticleTypes";
import { useFixtureEditing } from "./_composables/useFixtureEditing";
import { useArticleContext } from "./_composables/useArticleContext";
import { useFixtureValidation } from "./_composables/useFixtureValidation";
import { useFixtureSearchSort } from "./_composables/useFixtureSearchSort";
import { useArticleFormatting } from "./_composables/useArticleFormatting";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import PressboxConfirmationModal from "./_components/PressboxConfirmationModal.vue";
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
  if (first && typeof (first as any).accountId === "number")
    return (first as any).accountId;
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
const { feedbackCount, feedbackLimit, isLocked, updateFeedback } =
  useArticleFeedback();
const { articleStatus, articlePhase } = useArticleStatus(
  hasArticle,
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
  pollCount,
  isPollingActive,
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

const {
  canRequestReview,
  rewriteDisabledTooltip,
  executeArticleTrigger,
  markFixturesSavedForRegeneration,
} = useArticleTriggerFlow({
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
  supportsFixtureRegeneration: true,
});

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
  onSaveAllChanges: onSaveAllChangesOriginal,
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

// Wrap onSaveAllChanges to add refetch after save
async function onSaveAllChanges() {
  const success = await onSaveAllChangesOriginal();
  if (success) {
    markFixturesSavedForRegeneration();
  }
  if (success && resolvedArticleId.value) {
    try {
      await refreshFullAiArticle(resolvedArticleId.value);
    } catch (error) {
      console.error("Failed to refetch article after save:", error);
    }
  }
}

// Initialize fixture search/sort composable
const {
  searchQuery,
  sortBy,
  sortOrder,
  filteredAndSortedFixtures,
  getFixtureSummary,
} = useFixtureSearchSort(fixtures);

// Initialize fixture validation composable
const { requiredRule, dateRule } = useFixtureValidation();

// Form ref for validation
const fixtureFormRefComponent = ref<any>(null);

// Handler for save fixture with form validation
async function handleSaveFixture() {
  await onSaveFixture(fixtureFormRefComponent.value);
}

// Computed to check if polling is active (should only be true when status is pending AND timer is running)
const isPollingActiveComputed = computed(() => {
  const status = articleStatus.value;
  return isPollingActive.value && isArticleGenerationInFlight(status);
});

// Status text for polling debug
const pollingStatusText = computed(() => {
  return isPollingActiveComputed.value ? "🟢 Active" : "⚪ Inactive";
});

const buttonText = computed(() =>
  getPressboxButtonText(articlePhase.value, articleStatus.value)
);

const confirmationCopy = computed(() =>
  resolvePressboxConfirmationCopy("weekend", articlePhase.value)
);

// Show additional buttons (Add Context, Edit Fixture) whenever article is NOT locked
const showAdditionalButtons = computed(() => {
  return !isLocked.value;
});

function confirmAndRequest() {
  showConfirmationDialog.value = false;
  void executeArticleTrigger();
}
</script>
