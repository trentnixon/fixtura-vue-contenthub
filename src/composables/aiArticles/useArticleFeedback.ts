import { computed, ref } from "vue";
import { ArticleStatusData } from "@/store/aiArticles/service";
import { FEEDBACK_CONFIG } from "@/constants/articleConstants";
import { updateFeedbackFromResponse } from "@/types/ArticleTypes";

/**
 * Composable for managing article feedback state and lock logic
 */
export function useArticleFeedback() {
  const feedbackCount = ref<number>(0);
  const feedbackLimit = ref<number>(FEEDBACK_CONFIG.DEFAULT_LIMIT);

  /**
   * Check if article is locked (feedback count >= limit)
   */
  const isLocked = computed(() => {
    return feedbackCount.value >= feedbackLimit.value;
  });

  /**
   * Update feedback count and limit from API response
   */
  function updateFeedback(data: ArticleStatusData): void {
    updateFeedbackFromResponse(data, feedbackCount, feedbackLimit);
  }

  /**
   * Reset feedback state
   */
  function resetFeedback(): void {
    feedbackCount.value = 0;
    feedbackLimit.value = FEEDBACK_CONFIG.DEFAULT_LIMIT;
  }

  return {
    feedbackCount,
    feedbackLimit,
    isLocked,
    updateFeedback,
    resetFeedback,
  };
}
