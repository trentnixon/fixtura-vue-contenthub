<template>
  <!-- Dynamically load the asset component based on the selected asset type -->
  <template v-if="assetType.toLowerCase() === 'rosterposter'">
    <component
      :is="assetComponent"
      :formattedAssets="formattedAssets"
      :formattedArticles="aiArticles"
    />
  </template>
  <template v-else-if="formattedAssets.length === 0">
    <div class="text-center">No assets found</div>
  </template>

  <template v-else>
    <component
      :is="assetComponent"
      :formattedAssets="formattedAssets"
      :formattedArticles="aiArticles"
    />
  </template>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRenderAssets } from "@/pages/asset/composables/useRenderAssets"; // Import the composable
import { useRoute } from "vue-router";

import Weekendsinglegameresult from "@/pages/asset/assets/WeekendSingleGameResult.vue";
import Rosterposter from "@/pages/asset/assets/RosterPoster.vue";
import AssetDefaultView from "@/pages/asset/assets/AssetDefaultView.vue";

// Fetch the route to get the renderID
const route = useRoute();
const assetType = ref(route.params.asset);

// Fetch assets and articles using the new composable
const { selectedFixturaAsset } = useRenderAssets();

// Extract the first key dynamically from selectedFixturaAsset
const selectedRenderData = computed(() => {
  const keys = Object.keys(selectedFixturaAsset.value || {});
  if (keys.length > 0) {
    return selectedFixturaAsset.value[keys[0]]; // Get the first object under the key
  }
  return {};
});

// Format downloads from the selectedRenderData
const formattedAssets = computed(() => {
  const downloads = selectedRenderData.value?.downloads || [];

  // Ensure the selectedRenderData is valid and that downloads exist and are an array
  if (
    Object.keys(selectedRenderData.value).length === 0 ||
    !Array.isArray(downloads)
  ) {
    return [];
  }

  // Return formatted assets with all download URLs, error markers, and metadata
  return downloads.map((download) => ({
    id: download.id,
    name: download.name || "Unknown Asset",
    downloads: Array.isArray(download.downloads)
      ? download.downloads.map((d) => d.url)
      : [], // Handle null/undefined downloads
    category: download.assetCategory || "Unknown Category",
    hasError: download.hasError || false, // Check if there was an error
    errorHandler: download.errorHandler || null, // Capture the error handler if it exists
    hasBeenProcessed: download.hasBeenProcessed || false, // Check if the asset has been processed
    isAccurate: download.isAccurate || null, // Flag indicating if the asset is accurate (if applicable)
    completionTime: download.completionTime || "Unknown", // Capture the completion time
    numDownloads: download.numDownloads || 0, // Total number of downloads for this asset
    metadata: download.metadata || {}, // Any additional metadata
    forceRerender: download.forceRerender || false, // Flag to force rerender
  }));
});

// Pass AI articles directly without formatting
const aiArticles = computed(() => {
  return selectedRenderData.value?.aiArticles || [];
});

// Dynamically select the asset component based on the asset type
const assetComponent = computed(() => {
  switch (assetType.value.toLowerCase()) {
    case "weekendresults":
      return AssetDefaultView;
    case "top5bowlinglist":
      return AssetDefaultView;
    case "top5battinglist":
      return AssetDefaultView;
    case "ladder":
      return AssetDefaultView;
    case "upcomingfixtures":
      return AssetDefaultView;
    case "weekendsinglegameresult":
      return Weekendsinglegameresult;
    case "rosterposter":
      return Rosterposter;
    default:
      return null;
  }
});
</script>
