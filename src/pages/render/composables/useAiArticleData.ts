import { computed } from "vue";
import { useAiArticlesStore } from "@/store/aiArticles";
import { storeToRefs } from "pinia";

export function useAiArticleData() {
  const aiArticlesStore = useAiArticlesStore();
  const { aiArticle, aiArticlesByRenderID, loading, error } =
    storeToRefs(aiArticlesStore);

  // Fetch a single AI article by ID
  async function fetchAiArticleById(id: number) {
    try {
      await aiArticlesStore.fetchAiArticle(id);
    } catch (err) {
      console.error("Failed to fetch AI article:", err);
    }
  }

  // Fetch AI articles by render ID
  async function fetchAiArticlesByRenderId(renderId: number) {
    try {
      await aiArticlesStore.fetchAiArticlesByRenderId(renderId);
    } catch (err) {
      console.error("Failed to fetch AI articles by render ID:", err);
    }
  }

  // Group AI Articles by Asset Type
  const groupArticlesByAssetType = computed(() => {
    return aiArticlesByRenderID.value.reduce((acc, article) => {
      const type =
        article.attributes.asset_type?.data?.attributes?.Name || "Unknown";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(article);
      return acc;
    }, {} as Record<string, any[]>);
  });

  // Group AI Articles by Asset Category
  const groupArticlesByAssetCategory = computed(() => {
    return aiArticlesByRenderID.value.reduce((acc, article) => {
      const category =
        article.attributes.asset_category?.data?.attributes?.Name || "Unknown";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(article);
      return acc;
    }, {} as Record<string, any[]>);
  });

  // Get AI article by ID
  const getAiArticleById = (id: number) => {
    return (
      aiArticlesByRenderID.value.find((aiArticle) => aiArticle.id === id) ||
      null
    );
  };

  // Total number of AI Articles
  const totalAiArticles = computed(() => {
    return aiArticlesByRenderID.value.length;
  });

  // Number of AI Articles with Errors
  const aiArticlesWithErrors = computed(() => {
    return aiArticlesByRenderID.value.filter(
      (article) => article.attributes.hasError
    ).length;
  });

  // Count the number of AI Articles for a specific category
  const getArticleCountByCategory = (category: string) => {
    return groupArticlesByAssetCategory.value[category]?.length || 0;
  };

  // Count AI Articles with Errors by Category
  const aiArticlesWithErrorsByCategory = computed(() => {
    return aiArticlesByRenderID.value.reduce((acc, article) => {
      const category =
        article.attributes.asset_category?.data?.attributes?.Name || "Unknown";
      if (article.attributes.hasError) {
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category]++;
      }
      return acc;
    }, {} as Record<string, number>);
  });

  // Group AI Articles by Grouping Category and return the count of each
  const getAiArticleCountByGroupingCategory = computed(() => {
    return aiArticlesByRenderID.value.reduce((acc, article) => {
      const groupingCategory =
        article.attributes.grouping_category || "Unknown";
      if (!acc[groupingCategory]) {
        acc[groupingCategory] = 0;
      }
      acc[groupingCategory]++;
      return acc;
    }, {} as Record<string, number>);
  });

console.log("getAiArticleCountByGroupingCategory ", getAiArticleCountByGroupingCategory.value)

  return {
    aiArticle,
    aiArticlesByRenderID,
    loading,
    error,
    fetchAiArticleById,
    fetchAiArticlesByRenderId,
    getAiArticleById,
    groupArticlesByAssetType,
    groupArticlesByAssetCategory,
    totalAiArticles,
    aiArticlesWithErrors,
    getArticleCountByCategory,
    aiArticlesWithErrorsByCategory,
    getAiArticleCountByGroupingCategory,
  };
}
