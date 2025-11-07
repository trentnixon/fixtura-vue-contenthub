import { computed, type Ref } from "vue";
import type { FlattenedArticle } from "@/types/ArticleTypes";

/**
 * Top Scorer interface for Top5 articles
 */
export interface TopScorer {
  position: number;
  player_name: string;
  performance_stats: string;
  article_body: string;
}

/**
 * Formatted Top5 article structure
 */
export interface FormattedTop5Article {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  topScorers: TopScorer[];
  socialMediaPost: string;
  twitterPost: string;
  assetType: string;
  assetCategory: string;
  hasError: boolean;
  errorHandler: any | null;
  hasCompleted: boolean;
  forceRerender: boolean;
  compositionID: string;
  articleDataForPrompt?: { prompt: string }[] | null;
}

/**
 * Composable for Top5 article formatting and display logic
 */
export function useTop5Formatting(articles: Ref<FlattenedArticle[]>) {
  /**
   * Format Top5 articles from props into display-ready format
   */
  const formattedArticles = computed<FormattedTop5Article[]>(() => {
    const aiArticles = articles.value || [];
    return aiArticles.map((article: FlattenedArticle): FormattedTop5Article => {
      const structuredOutput = article.structuredOutput || {};
      return {
        id: article.id,
        name: article.name || "Unknown Article",
        title: structuredOutput.title || "No Title",
        subtitle: structuredOutput.subtitle || "No Subtitle",
        topScorers: structuredOutput.top_scorers || [],
        socialMediaPost: structuredOutput.social_media_post || "",
        twitterPost: structuredOutput.twitter_post || "",
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
        content += `${article.title}\n\n`;
        content += `${article.subtitle}\n\n`;
        content += article.topScorers
          .map(
            (scorer) =>
              `${scorer.position}. ${scorer.player_name}\n${scorer.performance_stats}\n${scorer.article_body}\n`
          )
          .join("\n");
        if (article.socialMediaPost) {
          content += `\nSocial Media Post: ${article.socialMediaPost}\n`;
        }
        if (article.twitterPost) {
          content += `\nTwitter Post: ${article.twitterPost}\n`;
        }
      });

      // Copy the content to the clipboard
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error("Failed to copy Top5 articles:", err);
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
