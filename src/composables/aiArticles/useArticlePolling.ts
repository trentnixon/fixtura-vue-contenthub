import { computed, onUnmounted, ref } from "vue";
import { POLLING_CONFIG } from "@/constants/articleConstants";
import {
  pollWeekendArticleStatus,
  fetchWeekendArticleDownload,
} from "@/store/aiArticles/actions";
import { ArticleStatusData } from "@/store/aiArticles/service";
import { ArticleIds } from "@/types/ArticleTypes";

/**
 * Composable for managing article polling logic
 */
export function useArticlePolling() {
  const pollTimer = ref<number | null>(null);
  const pollCount = ref(0);
  const isPollingActive = computed(() => pollTimer.value !== null);

  /**
   * Start polling for article status
   */
  function startPolling(
    ids: ArticleIds,
    onStatusUpdate: (data: ArticleStatusData) => void,
    onComplete?: () => void,
    onError?: (error: string) => void
  ): void {
    const { accountId, renderId, articleId } = ids;

    // Validate IDs
    if (!accountId || !renderId || !articleId) {
      console.warn("Cannot start polling: missing required IDs");
      return;
    }

    const start = Date.now();

    // Clear any previous timer
    if (pollTimer.value) {
      window.clearInterval(pollTimer.value);
      pollTimer.value = null;
    }

    // Reset poll count when starting
    pollCount.value = 0;

    pollTimer.value = window.setInterval(async () => {
      try {
        // Increment poll count on each iteration
        pollCount.value++;

        const res = await pollWeekendArticleStatus({
          accountId,
          renderId,
          articleId,
        });

        if (res.data) {
          const status = res.data.status;

          // Call status update callback
          onStatusUpdate(res.data);

          // Check status immediately after response - only continue if pending
          if (status !== "pending") {
            // Stop polling immediately for any other status
            stopPolling();

            if (status === "completed") {
              // Optionally fetch/download completed article
              try {
                await fetchWeekendArticleDownload(articleId);
                onComplete?.();
              } catch (e) {
                // swallow for now; UI might refresh elsewhere
              }
            } else if (status === "failed") {
              const errorMessage = res.data.locked
                ? "Article is locked (feedback limit reached or article too old)"
                : "Article generation failed";
              onError?.(errorMessage);
            }
            // For "writing", "waiting", or any other status, just stop polling
            return;
          }

          // Status is pending - continue polling
        }

        // Check timeout
        if (Date.now() - start >= POLLING_CONFIG.MAX_DURATION_MS) {
          stopPolling();
          onError?.("Timed out waiting for completion");
        }
      } catch (e: any) {
        stopPolling();
        onError?.(e?.message || "Error while polling");
      }
    }, POLLING_CONFIG.INTERVAL_MS) as unknown as number;
  }

  /**
   * Stop polling and cleanup
   */
  function stopPolling(): void {
    if (pollTimer.value) {
      window.clearInterval(pollTimer.value);
      pollTimer.value = null;
    }
  }

  /**
   * Reset poll count
   */
  function resetPollCount(): void {
    pollCount.value = 0;
  }

  // Cleanup on unmount
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
