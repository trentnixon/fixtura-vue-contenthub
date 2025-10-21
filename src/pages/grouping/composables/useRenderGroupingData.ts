// src/composables/useRenderGroupingData.ts
import { useRendersStore } from "@/store/renders"; // Your Pinia store
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

interface GroupingCategoryStats {
  downloads: number;
  videos: number;
  images: number;
  aiWriteups: number;
  hasErrors: boolean;
  results: number;
  upcoming: number;
}

export function useRenderGroupingData() {
  const renderStore = useRendersStore();
  const {
    selectedGrouping,
    loading,
    error,
    getTotalDownloads,
    getTotalAiArticles,
    getTotalGameResults,
    getTotalUpcomingGames,
    getTotalGrades,
    getTotalFixtures,
    getAssetsByType,
    getGroupingCategories,
  } = storeToRefs(renderStore);

  const route = useRoute();
  const groupingCategory = ref<string>(
    decodeURIComponent(String(route.params.groupingcategory))
  );

  // Helper function to normalize strings (trim spaces and convert to lowercase)
  const normalizeString = (str: string): string => str.trim().toLowerCase();

  const getSelectedCategoryStats = computed<GroupingCategoryStats | null>(
    () => {
      if (!getGroupingCategories.value || !groupingCategory.value) return null;

      // Normalize the grouping category (already decoded)
      const normalizedCategory = normalizeString(groupingCategory.value);

      // Normalize the keys in getGroupingCategories
      const normalizedCategories: Record<string, GroupingCategoryStats> =
        Object.keys(getGroupingCategories.value).reduce((acc, key) => {
          acc[normalizeString(key)] = getGroupingCategories.value[key];
          return acc;
        }, {} as Record<string, GroupingCategoryStats>);

      // Try to find a match with the normalized category
      /*  console.log({
        originalCategory: groupingCategory.value,
        decodedCategory,
        normalizedCategory,
        normalizedCategoriesKeys: Object.keys(normalizedCategories), // Log the normalized keys
        selectedCategoryStats: normalizedCategories[normalizedCategory],
      }); */

      return normalizedCategories[normalizedCategory] || null;
    }
  );

  // Watch for route param changes and update the groupingCategory
  watch(
    () => route.params.groupingcategory,
    (newCategory) => {
      groupingCategory.value = decodeURIComponent(String(newCategory));
    }
  );

  return {
    selectedGrouping,
    loading,
    error,
    getTotalDownloads,
    getTotalAiArticles,
    getTotalGameResults,
    getTotalUpcomingGames,
    getTotalGrades,
    getTotalFixtures,
    getAssetsByType,
    getGroupingCategories,
    getSelectedCategoryStats,
  };
}
