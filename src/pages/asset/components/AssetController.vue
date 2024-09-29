<template>
  <component
    :is="assetComponent"
    :formattedAssets="formattedAssets"
    :formattedArticles="getFullAiArticles"
  />
</template>

<script setup>
import { computed } from "vue";
import { useAssetDownloadData } from "@/pages/asset/composables/useAssetDownloadData"; // Import composable

import WeekendResults from "../assets/WeekendResults.vue";
import TopFive from "../assets/TopFive.vue";
import GradeLadder from "@/pages/asset/assets/GradeLadder.vue";
import Upcomingfixtures from "@/pages/asset/assets/UpcomingFixtures.vue";
import Weekendsinglegameresult from "@/pages/asset/assets/WeekendSingleGameResult.vue";
import Rosterposter from "@/pages/asset/assets/RosterPoster.vue";

// Fetch data using the composable
const { selectedAsset, getFullDownloads, getFullAiArticles } =
  useAssetDownloadData();

console.log("[getFullAiArticles]", getFullAiArticles.value);
// Helper function to format full downloads
function formatFullDownloads(fullDownloads) {
  return fullDownloads.map((download) => {
    const categoryIdentifier =
      download.value?.attributes?.asset_category?.data?.attributes?.Identifier;
    const url = download.value?.attributes?.downloads || null;
    const assetName = download.value?.attributes?.Name || "Unknown Asset";
    const metadata = download.value?.attributes?.Metadata || {};

    return {
      id: download.value?.id,
      name: assetName,
      url,
      category: categoryIdentifier, // VIDEO, IMAGE, etc.
      metadata,
    };
  });
}

// Compute formatted media assets
const formattedAssets = computed(() => {
  if (!getFullDownloads.value.length) return [];
  return formatFullDownloads(getFullDownloads.value);
});

// Dynamically select the asset component based on the asset type
const assetComponent = computed(() => {
  switch (selectedAsset.value?.type?.toLowerCase()) {
    case "weekendresults":
      return WeekendResults;
    case "top5bowlinglist":
      return TopFive;
    case "top5battinglist":
      return TopFive;
    case "ladder":
      return GradeLadder;
    case "upcomingfixtures":
      return Upcomingfixtures;
    case "weekendsinglegameresult":
      return Weekendsinglegameresult;
    case "rosterposter":
      return Rosterposter;
    default:
      return null;
  }
});
</script>
