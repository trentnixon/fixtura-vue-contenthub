import { computed, type Ref } from "vue";
import type { FormattedArticle, FlattenedArticle } from "@/types/ArticleTypes";

/**
 * Composable for article formatting and display logic
 */
export function useArticleFormatting(articles: Ref<FlattenedArticle[]>) {
  /**
   * Format articles from props into display-ready format
   */
  const formattedArticles = computed<FormattedArticle[]>(() => {
    const aiArticles = articles.value || [];
    // Return formatted AI articles based on structuredOutput results
    return aiArticles.flatMap((article: FlattenedArticle) => {
      const results = article.structuredOutput?.results || [];
      // Map each result as a separate formatted article
      return results.map((result: any): FormattedArticle => ({
        id: article.id,
        name: article.name || "Unknown Article",
        title: result.title || "No Title",
        subtitle: result.subtitle || "No Subtitle",
        articleBody: result.article_body || "No Article Body",
        highlights: result.highlights || "No Highlights",
        team1: result.team1 || "Team 1",
        team2: result.team2 || "Team 2",
        score1: result.score1 || "0",
        score2: result.score2 || "0",
        winner: result.winner || "No Winner",
        assetType: article.assetType || "Unknown Type",
        assetCategory: article.assetCategory || "Unknown Category",
        hasError: article.hasError || false,
        errorHandler: article.errorHandler || null,
        hasCompleted: article.hasCompleted || false,
        forceRerender: article.forceRerender || false,
        compositionID: article.compositionID || "Unknown Composition",
        articleDataForPrompt: article.ArticleDataForPrompt || null,
      }));
    });
  });

  /**
   * Check if articles exist
   */
  const hasArticle = computed(() => formattedArticles.value.length > 0);

  /**
   * Check if this is the first result for a given article ID
   */
  function isFirstResultForArticle(articleId: number, currentIndex: number): boolean {
    const firstIndex = formattedArticles.value.findIndex((a) => a.id === articleId);
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
        content += `${article.title}\n`;
        content += `${article.subtitle}\n`;
        content += `${article.team1} ${article.score1} vs ${article.team2} ${article.score2}\n\n`;
        content += `${article.articleBody}\n\n`;
        content += `Highlights: ${article.highlights}\n\n`;
      });

      // Copy the content to the clipboard
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error("Failed to copy articles:", err);
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

