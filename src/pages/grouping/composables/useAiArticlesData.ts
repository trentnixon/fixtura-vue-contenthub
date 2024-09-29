import { computed } from "vue";
import { useAiArticlesStore } from "@/store/aiArticles";
import { storeToRefs } from "pinia";

export function useAiArticlesData(groupingCategory: string | number) {
  const aiArticlesStore = useAiArticlesStore();
  const { aiArticlesByRenderID, loading, error } = storeToRefs(aiArticlesStore);

  // Fetch AI articles by render ID
  async function fetchAiArticlesByRenderId(renderId: number) {
    try {
      await aiArticlesStore.fetchAiArticlesByRenderId(renderId);
    } catch (err) {
      console.error("Failed to fetch AI articles by render ID:", err);
    }
  }

  // Filter AI articles by grouping category
  const aiArticlesByGroupingCategory = computed(() => {
    return aiArticlesByRenderID.value.filter((article) => {
      const category = article.attributes.grouping_category
        ? article.attributes.grouping_category.toLowerCase()
        : "unknown";
      return category === groupingCategory.toString().toLowerCase();
    });
  });

  return {
    aiArticlesByGroupingCategory,
    loading,
    error,
    fetchAiArticlesByRenderId,
  };
}
