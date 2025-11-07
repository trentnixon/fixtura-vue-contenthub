import { computed, type Ref } from "vue";
import type { FlattenedArticle } from "@/types/ArticleTypes";

/**
 * League interface for Ladder articles
 */
export interface League {
  title: string;
  subtitle: string;
  article_body: string;
}

/**
 * Formatted Ladder article structure
 */
export interface FormattedLadderArticle {
  id: number;
  name: string;
  leagues: League[];
  assetType: string;
  assetCategory: string;
  hasError: boolean;
  errorHandler: unknown | null;
  hasCompleted: boolean;
  forceRerender: boolean;
  compositionID: string;
  articleDataForPrompt?: { prompt: string }[] | null;
}

/**
 * Composable for Ladder article formatting and display logic
 */
export function useLadderFormatting(articles: Ref<FlattenedArticle[]>) {
  /**
   * Format Ladder articles from props into display-ready format
   */
  const formattedArticles = computed<FormattedLadderArticle[]>(() => {
    const aiArticles = articles.value || [];
    return aiArticles.map((article: FlattenedArticle): FormattedLadderArticle => {
      const structuredOutput = article.structuredOutput || {};
      return {
        id: article.id,
        name: article.name || "Unknown Article",
        leagues: structuredOutput.leagues || [],
        assetType: article.assetType || "Unknown Type",
        assetCategory: article.assetCategory || "Unknown Category",
        hasError: article.hasError || false,
        errorHandler: article.errorHandler || null,
        hasCompleted: article.hasCompleted || false,
        forceRerender: article.forceRerender || false,
        compositionID: article.compositionID || "Unknown Composition",
        articleDataForPrompt: article.ArticleDataForPrompt || null,
      };
    });
  });

  /**
   * Check if articles exist
   */
  const hasArticle = computed(() => formattedArticles.value.length > 0);

  /**
   * Check if this is the first result for a given article ID
   */
  function isFirstResultForArticle(
    articleId: number,
    currentIndex: number
  ): boolean {
    const firstIndex = formattedArticles.value.findIndex(
      (a) => a.id === articleId
    );
    return firstIndex === currentIndex;
  }

  /**
   * Format prompt data (parse JSON string and format it nicely)
   */
  function formatPromptData(promptString: string): string {
    try {
      const parsed = JSON.parse(promptString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      // If parsing fails, return the original string
      return promptString;
    }
  }

  /**
   * Get first asset details for display
   */
  const firstAssetDetails = computed(() => {
    const first = formattedArticles.value?.[0];
    if (!first) return null;
    return {
      name: first.name,
      assetType: first.assetType,
      assetCategory: first.assetCategory,
      compositionID: first.compositionID,
    };
  });

  /**
   * Copy article content to clipboard
   */
  async function copyArticle(): Promise<void> {
    try {
      if (!formattedArticles.value || formattedArticles.value.length === 0) {
        throw new Error("No articles available to copy.");
      }

      // Combine all article content into a single string
      let content = "";
      formattedArticles.value.forEach((article) => {
        content += article.leagues
          .map(
            (league) =>
              `${league.title}\n${league.subtitle}\n${league.article_body}\n\n`
          )
          .join("\n");
      });

      // Copy the content to the clipboard
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error("Failed to copy Ladder articles:", err);
      throw err;
    }
  }

  return {
    formattedArticles,
    hasArticle,
    firstAssetDetails,
    isFirstResultForArticle,
    formatPromptData,
    copyArticle,
  };
}
