import { computed, onUnmounted, ref } from "vue";
import {
  isArticleGenerationInFlight,
  POLLING_CONFIG,
} from "@/constants/articleConstants";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";
import { isTransientNetworkError } from "@/composables/aiArticles/parseTriggerError";
import { pollWeekendArticleStatus } from "@/store/aiArticles/actions";
import { ArticleStatusData } from "@/store/aiArticles/service";
import { ArticleIds } from "@/types/ArticleTypes";

/**
 * Poll CMS until generation leaves in-flight states (pending | writing).
 */
export function useArticlePolling() {
  const pollTimer = ref<number | null>(null);
  const pollCount = ref(0);
  const consecutiveNetworkErrors = ref(0);
  const isPollingActive = computed(() => pollTimer.value !== null);

  function startPolling(
    ids: ArticleIds,
    onStatusUpdate: (data: ArticleStatusData) => void,
    onComplete?: () => void,
    onError?: (error: string) => void,
    onTimeout?: () => void
  ): void {
    const { accountId, renderId, articleId } = ids;

    if (!accountId || !renderId || !articleId) {
      console.warn("Cannot start polling: missing required IDs");
      return;
    }

    const start = Date.now();

    if (pollTimer.value) {
      window.clearInterval(pollTimer.value);
      pollTimer.value = null;
    }

    pollCount.value = 0;
    consecutiveNetworkErrors.value = 0;

    pollTimer.value = window.setInterval(async () => {
      try {
        pollCount.value++;

        const res = await pollWeekendArticleStatus({
          accountId,
          renderId,
          articleId,
        });

        consecutiveNetworkErrors.value = 0;

        if (res.data) {
          const status = res.data.status;
          onStatusUpdate(res.data);

          if (!isArticleGenerationInFlight(status)) {
            stopPolling();

            if (status === "completed") {
              onComplete?.();
            } else if (status === "failed") {
              const errorMessage = res.data.locked
                ? PRESSBOX_COPY.errors.locked
                : PRESSBOX_COPY.errors.generationFailed;
              onError?.(errorMessage);
            }
            return;
          }
        }

        if (Date.now() - start >= POLLING_CONFIG.MAX_DURATION_MS) {
          stopPolling();
          onTimeout?.();
        }
      } catch (e: unknown) {
        if (isTransientNetworkError(e)) {
          consecutiveNetworkErrors.value++;
          if (
            consecutiveNetworkErrors.value <
            POLLING_CONFIG.MAX_CONSECUTIVE_NETWORK_ERRORS
          ) {
            return;
          }
        }

        stopPolling();
        const message =
          e instanceof Error
            ? isTransientNetworkError(e)
              ? PRESSBOX_COPY.errors.networkError
              : e.message
            : "Error while polling";
        onError?.(message);
      }
    }, POLLING_CONFIG.INTERVAL_MS) as unknown as number;
  }

  function stopPolling(): void {
    if (pollTimer.value) {
      window.clearInterval(pollTimer.value);
      pollTimer.value = null;
    }
  }

  function resetPollCount(): void {
    pollCount.value = 0;
    consecutiveNetworkErrors.value = 0;
  }

  onUnmounted(() => {
    stopPolling();
  });

  return {
    pollTimer,
    pollCount,
    isPollingActive,
    startPolling,
    stopPolling,
    resetPollCount,
  };
}
