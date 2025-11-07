import { computed, ref, watch, type Ref } from "vue";
import { usePrivateAiArticleState } from "@/store/aiArticles/private";
import { ArticlePhase, ArticleStatus } from "@/types/ArticleTypes";

/**
 * Composable for managing article status and phase detection
 */
export function useArticleStatus(
  hasArticle: Ref<boolean>,
  feedbackCount: Ref<number>,
  articles?: Ref<Array<{ createdAt?: string }>>
) {
  const storeState = usePrivateAiArticleState();
  const articleStatus = computed<ArticleStatus>(() => {
    const rawStatus = storeState.status;

    // Backward compatibility for legacy articles:
    // - If status is null/undefined → treat as "waiting"
    // - If status is "idle" but articles exist → treat as "waiting" (legacy articles without status API call)
    // - Otherwise use the status as-is
    if (rawStatus == null) {
      return "waiting";
    }

    if (rawStatus === "idle" && hasArticle.value) {
      return "waiting";
    }

    return rawStatus as ArticleStatus;
  });

  /**
   * Detect if this is a legacy article (incompatible with new system)
   * Legacy articles are detected ONLY by creation date:
   * - If createdAt exists and is earlier than November 7, 2025 (7/11/2025), it's legacy
   * - We don't use status-based detection as articles could have values
   */
  const isLegacy = computed(() => {
    // Legacy cutoff: November 7, 2025 (7/11/2025)
    const LEGACY_CUTOFF_DATE = new Date("2025-11-07");

    if (!articles?.value || articles.value.length === 0) {
      return false;
    }

    const firstArticle = articles.value[0];
    // Check if createdAt exists and is not "Unknown Date" or empty
    if (
      !firstArticle.createdAt ||
      firstArticle.createdAt === "Unknown Date" ||
      firstArticle.createdAt.trim() === ""
    ) {
      return false;
    }

    const articleDate = new Date(firstArticle.createdAt);

    // Check if date is valid
    if (isNaN(articleDate.getTime())) {
      return false;
    }

    return articleDate < LEGACY_CUTOFF_DATE;
  });
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
    isLegacy,
  };
}
