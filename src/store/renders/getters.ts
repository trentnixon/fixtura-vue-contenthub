import { computed } from "vue";
import { usePrivateRendersState } from "./private";

// Single render-related getters
export const selectedRender = computed(
  () => usePrivateRendersState().selectedRender
);
export const loading = computed(() => usePrivateRendersState().loading);
export const error = computed(() => usePrivateRendersState().error);

export const getProcessing = computed(() => {
  return selectedRender.value?.processing;
});

export const getComplete = computed(() => {
  return selectedRender.value?.complete;
});

export const getRenderDate = computed(() => {
  return selectedRender.value?.date;
});

export const getRenderTime = computed(() => {
  return selectedRender.value?.time;
});

// Getter to expose the metrics
export const renderMetrics = computed(
  () => usePrivateRendersState().selectedRender?.metrics
);

export const getRenderTableData = computed(() => {
  return selectedRender.value?.metrics.groupingCategories;
});
/** End Single Render */

/** Grouping Render */

// Getter to access the selected grouping
export const selectedGrouping = computed(
  () => usePrivateRendersState().selectedGrouping
);

// Get the total downloads for the selected grouping
export const getTotalDownloads = computed(() => {
  return selectedGrouping.value?.downloads || 0;
});

// Get the total AI articles for the selected grouping
export const getTotalAiArticles = computed(() => {
  return selectedGrouping.value?.aiArticles || 0;
});

// Get the metrics summary for the selected grouping
export const getGroupingMetricsSummary = computed(() => {
  return selectedGrouping.value?.metrics.summary || {};
});

// Get the grouping categories metrics (e.g., Junior, Senior)
export const getGroupingCategories = computed(() => {
  return selectedGrouping.value?.metrics.groupingCategories || {};
});

// Get the asset category split (video, image, writeup) for the selected grouping
export const getAssetCategorySplit = computed(() => {
  return selectedGrouping.value?.metrics.assetCategorySplit || {};
});

// Get a specific asset type (e.g., WeekendResults, Top5BowlingList) for the grouping
export const getAssetsByType = computed(() => {
  return selectedGrouping.value?.assets || {};
});

// Get total game results for the selected grouping
export const getTotalGameResults = computed(() => {
  return selectedGrouping.value?.metrics.summary.totalGameResults || 0;
});

// Get total upcoming games for the selected grouping
export const getTotalUpcomingGames = computed(() => {
  return selectedGrouping.value?.metrics.summary.totalUpcomingGames || 0;
});

// Get total grades for the selected grouping
export const getTotalGrades = computed(() => {
  return selectedGrouping.value?.metrics.summary.totalGrades || 0;
});

// Get total fixtures for the selected grouping
export const getTotalFixtures = computed(() => {
  return selectedGrouping.value?.metrics.summary.totalFixtures || 0;
});

// Get the error count for the selected grouping
export const getTotalErrors = computed(() => {
  return selectedGrouping.value?.metrics.summary.totalErrors || 0;
});
