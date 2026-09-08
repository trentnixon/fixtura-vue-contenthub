import { computed, onUnmounted, ref, type ComputedRef, type Ref } from "vue";
import { isArticleGenerationInFlight } from "@/constants/articleConstants";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";
import {
  pollWeekendArticleStatus,
  refreshFullAiArticle,
  resetArticleGenerationAction,
  triggerWeekendArticleAction,
} from "@/store/aiArticles/actions";
import { usePrivateAiArticleState } from "@/store/aiArticles/private";
import type { ArticlePhase, ArticleStatus } from "@/types/ArticleTypes";
import { parseTriggerError } from "./parseTriggerError";
import {
  canRequestRegeneration,
  getRewriteDisabledTooltip,
  isFailedGenerationRetry,
  resolveTriggerRequestReason,
  type RegenerationGateInput,
} from "./pressboxTrigger";
import type { useArticleFeedback } from "./useArticleFeedback";
import type { ArticleIds } from "@/types/ArticleTypes";

type FeedbackApi = Pick<
  ReturnType<typeof useArticleFeedback>,
  "updateFeedback"
>;

export interface ArticleTriggerFlowOptions {
  accountId: () => number | null;
  renderId: () => number | null;
  articleId: () => number | null;
  articlePhase: ComputedRef<ArticlePhase>;
  articleStatus: ComputedRef<ArticleStatus>;
  hasContext: Ref<boolean>;
  fixturesSavedForRegeneration?: Ref<boolean>;
  supportsFixtureRegeneration?: boolean;
  isLocked: ComputedRef<boolean>;
  isPending: Ref<boolean>;
  updateFeedback: FeedbackApi["updateFeedback"];
  startGenerationPolling: (ids: ArticleIds) => void;
  requestError?: Ref<string>;
  onRegenerationTriggered?: () => void;
}

export function useArticleTriggerFlow(options: ArticleTriggerFlowOptions) {
  const requestError = options.requestError ?? ref("");
  const storeState = usePrivateAiArticleState();

  const fixturesSavedForRegeneration =
    options.fixturesSavedForRegeneration ?? ref(false);
  const supportsFixtureRegeneration =
    options.supportsFixtureRegeneration ?? false;

  const gateInput = computed<RegenerationGateInput>(() => ({
    articlePhase: options.articlePhase.value,
    articleStatus: options.articleStatus.value,
    isLocked: options.isLocked.value,
    isPending: options.isPending.value,
    hasContext: options.hasContext.value,
    fixturesSavedForRegeneration: fixturesSavedForRegeneration.value,
    supportsFixtureRegeneration,
  }));

  const canRequestReview = computed(() =>
    canRequestRegeneration(gateInput.value)
  );

  const rewriteDisabledTooltip = computed(
    () => getRewriteDisabledTooltip(gateInput.value) ?? undefined
  );

  function clearFixturesSavedFlag() {
    fixturesSavedForRegeneration.value = false;
  }

  function markFixturesSavedForRegeneration() {
    fixturesSavedForRegeneration.value = true;
  }

  onUnmounted(() => {
    clearFixturesSavedFlag();
  });

  async function executeArticleTrigger(): Promise<void> {
    requestError.value = "";

    const accountId = options.accountId();
    const renderId = options.renderId();
    const articleId = options.articleId();

    if (
      typeof accountId !== "number" ||
      typeof renderId !== "number" ||
      typeof articleId !== "number"
    ) {
      requestError.value =
        "Missing required identifiers (accountId, renderId, articleId).";
      return;
    }

    const isFailedRetry = isFailedGenerationRetry(options.articleStatus.value);
    const isRegeneration =
      options.articlePhase.value === "articleWritten" && !isFailedRetry;

    if (
      !isFailedRetry &&
      isRegeneration &&
      !canRequestRegeneration(gateInput.value)
    ) {
      requestError.value =
        getRewriteDisabledTooltip(gateInput.value) ??
        "Add editorial context or save fixture changes before requesting a review.";
      return;
    }

    if (isFailedRetry && !canRequestRegeneration(gateInput.value)) {
      requestError.value =
        getRewriteDisabledTooltip(gateInput.value) ??
        PRESSBOX_COPY.errors.lockedLimit;
      return;
    }

    const requestReason = resolveTriggerRequestReason({
      isRegeneration,
      isFailedRetry,
      hasContext: options.hasContext.value,
      fixturesSavedForRegeneration: fixturesSavedForRegeneration.value,
    });

    if (isRegeneration && !requestReason) {
      requestError.value =
        "Add editorial context or save fixture changes before requesting a review.";
      return;
    }

    const priorStatus = isRegeneration ? storeState.status : undefined;
    let restoreStatusOnError = priorStatus;
    options.isPending.value = true;

    try {
      if (isFailedRetry) {
        try {
          const resetData = await resetArticleGenerationAction({
            accountId,
            renderId,
            articleId,
          });
          options.updateFeedback(resetData);
          restoreStatusOnError =
            (resetData.status as typeof storeState.status) ?? storeState.status;

          if (resetData.status === "completed") {
            try {
              await refreshFullAiArticle(articleId);
            } catch (refreshError) {
              console.warn(
                "[useArticleTriggerFlow] refresh after reset failed:",
                refreshError
              );
            }
          }
        } catch (resetError) {
          requestError.value = parseTriggerError(resetError);
          options.isPending.value = false;
          return;
        }
      }

      await triggerWeekendArticleAction(
        {
          accountId,
          renderId,
          articleId,
          ...(requestReason && requestReason !== "initial"
            ? { requestReason }
            : {}),
        },
        { restoreStatusOnError: restoreStatusOnError ?? "idle" }
      );

      if (isRegeneration) {
        options.onRegenerationTriggered?.();
        clearFixturesSavedFlag();
      }

      const statusRes = await pollWeekendArticleStatus({
        accountId,
        renderId,
        articleId,
      });

      if (statusRes.data) {
        const status = statusRes.data.status;
        options.updateFeedback(statusRes.data);

        if (isArticleGenerationInFlight(status)) {
          options.startGenerationPolling({ accountId, renderId, articleId });
        } else {
          options.isPending.value = false;
          if (status === "completed") {
            try {
              await refreshFullAiArticle(articleId);
            } catch (error) {
              console.warn(
                "[useArticleTriggerFlow] refresh after trigger failed:",
                error
              );
            }
          } else if (status === "failed") {
            requestError.value = statusRes.data.locked
              ? PRESSBOX_COPY.errors.locked
              : PRESSBOX_COPY.errors.generationFailedPeriod;
          }
        }
      }
    } catch (error: unknown) {
      requestError.value = parseTriggerError(error);
      options.isPending.value = false;
    }
  }

  return {
    requestError,
    canRequestReview,
    rewriteDisabledTooltip,
    executeArticleTrigger,
    markFixturesSavedForRegeneration,
    clearFixturesSavedFlag,
  };
}
