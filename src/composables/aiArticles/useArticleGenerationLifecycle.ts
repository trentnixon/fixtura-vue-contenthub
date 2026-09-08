import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type ComputedRef,
  type Ref,
} from "vue";
import { isArticleGenerationInFlight } from "@/constants/articleConstants";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";
import { parseTriggerError } from "@/composables/aiArticles/parseTriggerError";
import {
  pollWeekendArticleStatus,
  refreshFullAiArticle,
} from "@/store/aiArticles/actions";
import type { ArticleStatusData } from "@/store/aiArticles/service";
import type { ArticleIds, ArticleStatus } from "@/types/ArticleTypes";
import { useArticlePolling } from "./useArticlePolling";

type ResolvedArticleIds = {
  accountId: number;
  renderId: number;
  articleId: number;
};

export interface ArticleGenerationLifecycleOptions {
  accountId: () => number | null;
  renderId: () => number | null;
  articleId: () => number | null;
  articleStatus: ComputedRef<ArticleStatus>;
  isPending: Ref<boolean>;
  updateFeedback: (data: ArticleStatusData) => void;
  requestError?: Ref<string>;
  /** Called after mount status check (e.g. fetchExistingContext). */
  onMountComplete?: () => void | Promise<void>;
}

function resolveArticleIds(
  options: ArticleGenerationLifecycleOptions
): ResolvedArticleIds | null {
  const accountId = options.accountId();
  const renderId = options.renderId();
  const articleId = options.articleId();

  if (
    typeof accountId !== "number" ||
    typeof renderId !== "number" ||
    typeof articleId !== "number"
  ) {
    return null;
  }

  return { accountId, renderId, articleId };
}

function setFailedStatusMessage(
  data: ArticleStatusData,
  requestError?: Ref<string>
): void {
  if (!requestError) {
    return;
  }

  requestError.value = data.locked
    ? PRESSBOX_COPY.errors.locked
    : PRESSBOX_COPY.errors.generationFailed;
}

export function useArticleGenerationLifecycle(
  options: ArticleGenerationLifecycleOptions
) {
  const {
    pollCount,
    isPollingActive,
    startPolling,
    stopPolling,
    resetPollCount,
  } = useArticlePolling();
  const isPollingTimedOut = ref(false);
  const isCheckingStatus = ref(false);

  async function refreshArticleContent(articleId: number): Promise<void> {
    await refreshFullAiArticle(articleId);
  }

  function syncInFlightPending(status: string | null | undefined): void {
    options.isPending.value = isArticleGenerationInFlight(status);
  }

  function handleStatusUpdate(data: ArticleStatusData): void {
    options.updateFeedback(data);
    syncInFlightPending(data.status);
  }

  function handlePollingError(error: string): void {
    if (options.requestError) {
      options.requestError.value = error;
    }
    options.isPending.value = false;
  }

  function handlePollingTimeout(): void {
    isPollingTimedOut.value = true;
    options.isPending.value = false;
    if (options.requestError) {
      options.requestError.value = "";
    }
  }

  async function checkGenerationStatus(): Promise<void> {
    const ids = resolveArticleIds(options);
    if (!ids) {
      return;
    }

    isCheckingStatus.value = true;
    isPollingTimedOut.value = false;

    try {
      const statusRes = await pollWeekendArticleStatus({
        accountId: ids.accountId,
        renderId: ids.renderId,
        articleId: ids.articleId,
      });

      if (!statusRes.data) {
        return;
      }

      handleStatusUpdate(statusRes.data);
      const status = statusRes.data.status;

      if (isArticleGenerationInFlight(status)) {
        startGenerationPolling(ids);
      } else if (status === "completed") {
        options.isPending.value = false;
        await refreshArticleContent(ids.articleId);
      } else if (status === "failed") {
        options.isPending.value = false;
        setFailedStatusMessage(statusRes.data, options.requestError);
      }
    } catch (error) {
      isPollingTimedOut.value = true;
      if (options.requestError) {
        options.requestError.value = parseTriggerError(error);
      }
    } finally {
      isCheckingStatus.value = false;
    }
  }

  function keepWaitingForGeneration(): void {
    const ids = resolveArticleIds(options);
    if (!ids) {
      return;
    }

    isPollingTimedOut.value = false;
    if (options.requestError) {
      options.requestError.value = "";
    }
    startGenerationPolling(ids);
  }

  async function handleGenerationComplete(articleId: number): Promise<void> {
    options.isPending.value = false;
    try {
      await refreshArticleContent(articleId);
    } catch (error) {
      console.warn("[useArticleGenerationLifecycle] refresh failed:", error);
    }
  }

  function startGenerationPolling(ids: ArticleIds): void {
    const { accountId, renderId, articleId } = ids;

    if (!accountId || !renderId || !articleId) {
      return;
    }

    isPollingTimedOut.value = false;
    options.isPending.value = true;

    startPolling(
      { accountId, renderId, articleId },
      handleStatusUpdate,
      () => {
        void handleGenerationComplete(articleId);
      },
      handlePollingError,
      handlePollingTimeout
    );
  }

  async function resumePollingOnMount(): Promise<void> {
    const ids = resolveArticleIds(options);
    if (!ids) {
      return;
    }

    try {
      const statusRes = await pollWeekendArticleStatus({
        accountId: ids.accountId,
        renderId: ids.renderId,
        articleId: ids.articleId,
      });

      if (!statusRes.data) {
        return;
      }

      handleStatusUpdate(statusRes.data);
      const status = statusRes.data.status;

      if (isArticleGenerationInFlight(status)) {
        startGenerationPolling(ids);
      } else if (status === "completed") {
        options.isPending.value = false;
        await refreshArticleContent(ids.articleId);
      } else if (status === "failed") {
        options.isPending.value = false;
        setFailedStatusMessage(statusRes.data, options.requestError);
      }
    } catch (error) {
      console.warn(
        "[useArticleGenerationLifecycle] mount status check failed:",
        error
      );
    } finally {
      await options.onMountComplete?.();
    }
  }

  watch(
    () => options.articleStatus.value,
    (newStatus) => {
      syncInFlightPending(newStatus);
      if (!isArticleGenerationInFlight(newStatus)) {
        stopPolling();
      }
    }
  );

  onMounted(() => {
    void resumePollingOnMount();
  });

  onUnmounted(() => {
    stopPolling();
  });

  return {
    pollCount,
    isPollingActive,
    isPollingTimedOut,
    isCheckingStatus,
    startGenerationPolling,
    resumePollingOnMount,
    stopPolling,
    resetPollCount,
    refreshArticleContent,
    checkGenerationStatus,
    keepWaitingForGeneration,
  };
}
