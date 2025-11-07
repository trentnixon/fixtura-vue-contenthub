import { computed, ref, watch, type Ref } from "vue";
import { usePrivateAiArticleState } from "@/store/aiArticles/private";
import { ArticlePhase, ArticleStatus } from "@/types/ArticleTypes";

/**
 * Composable for managing article status and phase detection
 */
export function useArticleStatus(
  hasArticle: Ref<boolean>,
  feedbackCount: Ref<number>
) {
  const storeState = usePrivateAiArticleState();
  const articleStatus = computed<ArticleStatus>(
    // Backward compatibility: treat null/undefined status as "waiting"
    () => (storeState.status ?? "waiting") as ArticleStatus
  );
  const previousStatus = ref<ArticleStatus | null>(null);

  /**
   * Detect article lifecycle phase based on status and article existence
   */
  const articlePhase = computed<ArticlePhase>(() => {
    const status = articleStatus.value;
    const userFeedbackCount = feedbackCount.value;

    // Initial: No article yet and feedback count is 0
    if (
      !hasArticle.value &&
      userFeedbackCount === 0 &&
      status !== "pending" &&
      status !== "writing"
    ) {
      return "initial";
    }

    // Pending/Writing: Status is pending or writing
    if (status === "pending" || status === "writing") {
      return "pending";
    }

    // PostPending: Transitioning from pending to completed (detected by watcher)
    if (status === "completed" && previousStatus.value === "pending") {
      return "postPending";
    }

    // ArticleWritten: Article exists and status is completed/waiting/failed
    if (
      hasArticle.value &&
      (status === "completed" || status === "waiting" || status === "failed")
    ) {
      return "articleWritten";
    }

    // Default to initial
    return "initial";
  });

  /**
   * Watch for status changes and track previous status
   */
  watch(articleStatus, (newStatus, oldStatus) => {
    if (oldStatus !== undefined) {
      previousStatus.value = oldStatus;
    }
  });

  return {
    articleStatus,
    articlePhase,
    previousStatus,
  };
}
