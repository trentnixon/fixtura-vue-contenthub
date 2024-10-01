// src/composables/useRenderGroupingData.ts
import { useRendersStore } from "@/store/renders"; // Your Pinia store
import { storeToRefs } from "pinia";

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
  } = storeToRefs(renderStore);

  /*  Add any Grouped render computed properties here */

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
  };
}
