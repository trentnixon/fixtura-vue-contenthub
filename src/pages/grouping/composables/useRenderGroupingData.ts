// src/composables/useRenderGroupingData.ts
import { useRendersStore } from "@/store/renders"; // Your Pinia store
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

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

  /*  Add any Grouped render computed properties here */
  const route = useRoute();
  const groupingCategory = ref(route.params.groupingcategory);

  const getSelectedCategoryStats = computed(() => {
    if (!getGroupingCategories.value || !groupingCategory.value) return null;

    // Decode and capitalize the groupingCategory
    const decodedCategory = decodeURIComponent(
      groupingCategory.value as string
    );
    const capitalizedCategory = decodedCategory
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return getGroupingCategories.value[capitalizedCategory] || null;
  });

  watch(
    () => route.params.groupingcategory,
    (newCategory) => {
      groupingCategory.value = newCategory;
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
