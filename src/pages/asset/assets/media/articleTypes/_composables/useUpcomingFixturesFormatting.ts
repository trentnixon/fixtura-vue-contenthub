import { computed, type Ref } from "vue";
import type { FlattenedArticle } from "@/types/ArticleTypes";

/**
 * Fixture interface for UpcomingFixtures articles
 */
export interface UpcomingFixture {
  match: string;
  date: string;
  time: string;
  ground: string;
  summary: string;
}

/**
 * Formatted UpcomingFixtures article structure
 */
export interface FormattedUpcomingFixturesArticle {
  id: number;
  name: string;
  fixtures: UpcomingFixture[];
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
 * Composable for UpcomingFixtures article formatting and display logic
 */
export function useUpcomingFixturesFormatting(articles: Ref<FlattenedArticle[]>) {
  /**
   * Format UpcomingFixtures articles from props into display-ready format
   */
  const formattedArticles = computed<FormattedUpcomingFixturesArticle[]>(() => {
    const aiArticles = articles.value || [];
    return aiArticles.map((article: FlattenedArticle): FormattedUpcomingFixturesArticle => {
      const structuredOutput = article.structuredOutput || {};
      return {
        id: article.id,
        name: article.name || "Unknown Article",
        fixtures: structuredOutput.fixtures || [],
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

      // Combine all fixture content into a single string
      let content = "";
      formattedArticles.value.forEach((article) => {
        content += article.fixtures
          .map(
            (fixture) =>
              `${fixture.match}\n${fixture.date} : ${fixture.time}\n${fixture.ground !== 'N/A' ? fixture.ground : ''}\n\n${fixture.summary}\n\n`
          )
          .join("\n");
      });

      // Copy the content to the clipboard
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error("Failed to copy UpcomingFixtures articles:", err);
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
