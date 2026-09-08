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
  const apiLocked = ref<boolean>(false);
  const canProvideFeedback = ref<boolean>(true);

  /**
   * Locked when CMS reports lock, disallows regeneration, or attempt count at limit.
   */
  const isLocked = computed(() => {
    return (
      apiLocked.value ||
      !canProvideFeedback.value ||
      feedbackCount.value >= feedbackLimit.value
    );
  });

  /**
   * Update feedback count and limit from API response
   */
  function updateFeedback(data: ArticleStatusData): void {
    updateFeedbackFromResponse(data, feedbackCount, feedbackLimit);

    if (typeof data.locked === "boolean") {
      apiLocked.value = data.locked;
    }

    if (typeof data.feedback?.canProvideFeedback === "boolean") {
      canProvideFeedback.value = data.feedback.canProvideFeedback;
    }
  }

  /**
   * Reset feedback state
   */
  function resetFeedback(): void {
    feedbackCount.value = 0;
    feedbackLimit.value = FEEDBACK_CONFIG.DEFAULT_LIMIT;
    apiLocked.value = false;
    canProvideFeedback.value = true;
  }

  return {
    feedbackCount,
    feedbackLimit,
    isLocked,
    apiLocked,
    canProvideFeedback,
    updateFeedback,
    resetFeedback,
  };
}
