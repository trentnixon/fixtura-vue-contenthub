import { computed, type Ref } from "vue";
import type { FlattenedArticle } from "@/types/ArticleTypes";

/**
 * Composable for checking if articles are legacy (incompatible with new system)
 * Legacy articles are detected by creation date:
 * - If createdAt exists and is earlier than November 7, 2025 (7/11/2025), it's legacy
 */
export function useLegacyCheck(articles: Ref<FlattenedArticle[]>) {
  // Legacy cutoff: November 7, 2025 (7/11/2025)
  const LEGACY_CUTOFF_DATE = new Date("2025-11-07");

  /**
   * Check if any article is legacy
   */
  const isLegacy = computed(() => {
    if (!articles.value || articles.value.length === 0) {
      return false;
    }

    // Check if any article has createdAt before the cutoff date
    const hasLegacyArticle = articles.value.some((article) => {
      // Check if createdAt exists and is not "Unknown Date" or empty
      if (
        !article.createdAt ||
        article.createdAt === "Unknown Date" ||
        article.createdAt.trim() === ""
      ) {
        return false;
      }

      const articleDate = new Date(article.createdAt);

      // Check if date is valid
      if (isNaN(articleDate.getTime())) {
        return false;
      }

      return articleDate < LEGACY_CUTOFF_DATE;
    });

    return hasLegacyArticle;
  });

  return {
    isLegacy,
  };
}
