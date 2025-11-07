<template>
  <!-- Dynamically load the asset component based on the selected asset type -->
  <template v-if="assetType.toLowerCase() === 'cricketroster'">
    <component :is="assetComponent" :formattedAssets="formattedAssets" :formattedArticles="aiArticles" />
  </template>
  <template v-else-if="formattedAssets.length === 0">
    <div class="text-center">No assets found</div>
  </template>

  <template v-else>
    <!-- <div class="d-flex justify-end my-4">
      <PrimaryButton
        color="success"
        label="Edit"
        @click="navigateToEdit()"
        :icon="icons.ui.edit"
        size="small"
      />
    </div>
 -->
    <component :is="assetComponent" :formattedAssets="formattedAssets" :formattedArticles="aiArticles" />
  </template>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRenderAssets } from "@/pages/asset/composables/useRenderAssets";
import { useRoute } from "vue-router";
import { useAiArticlesStore } from "@/store/aiArticles";

import Weekendsinglegameresult from "@/pages/asset/assets/WeekendSingleGameResult.vue";
import Rosterposter from "@/pages/asset/assets/RosterPoster.vue";
import AssetDefaultView from "@/pages/asset/assets/AssetDefaultView.vue";
//import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";

//const icons = inject("icons");
// Fetch the route to get the renderID
//const router = useRouter();
const route = useRoute();

// Get AI articles store to enrich articles with createdAt
const aiArticlesStore = useAiArticlesStore();

function toPascalCase(str) {
  return str
    .replace(/(^|_|-|\s)+(\w)/g, (_, __, c) => c.toUpperCase())
    .replace(/^(\w)/, (c) => c.toUpperCase());
}

const assetType = ref(toPascalCase(route.params.asset));

watch(
  () => route.params.asset,
  (newAsset) => {
    assetType.value = toPascalCase(newAsset);
  }
);

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
    editCount: download.editCount || 0,
    editTrigger: download.editTrigger || false,
    hasBeenEdited: download.hasBeenEdited || false,
  }));
});

// Track if we've fetched full articles
const fullArticlesFetched = ref(false);

// Fetch full articles when articles are available
watch(
  () => selectedRenderData.value?.aiArticles,
  async (articles) => {
    if (articles && articles.length > 0 && !fullArticlesFetched.value) {
      const articleIds = articles.map((a) => a.id);
      try {
        await aiArticlesStore.fetchFullAiArticlesByIds(articleIds);
        fullArticlesFetched.value = true;
      } catch (error) {
        console.error("[AssetController] Error fetching full articles:", error);
      }
    }
  },
  { immediate: true }
);

// Pass AI articles with createdAt field enriched from full article store
const aiArticles = computed(() => {
  const articles = selectedRenderData.value?.aiArticles || [];

  if (articles.length === 0) {
    return [];
  }

  // Get full articles from store to enrich with createdAt
  const fullArticles = aiArticlesStore.getFullAiArticles();

  // Map createdAt from full articles if available
  return articles.map((article) => {
    const fullArticle = fullArticles[article.id];
    const createdAt = fullArticle?.attributes?.createdAt;

    // Use createdAt if valid, otherwise fall back to publishedAt for legacy detection
    let dateToUse = null;

    if (createdAt && createdAt !== "Unknown Date" && createdAt.trim() !== "") {
      dateToUse = createdAt;
    } else {
      // Fall back to publishedAt if createdAt is not available
      const publishedAt = fullArticle?.attributes?.publishedAt;
      if (publishedAt && publishedAt !== "Unknown Date" && publishedAt.trim() !== "") {
        dateToUse = publishedAt;
      }
    }

    if (dateToUse) {
      return {
        ...article,
        createdAt: dateToUse, // Store in createdAt field for legacy check
      };
    }

    return article;
  });
});

// Dynamically select the asset component based on the asset type
const assetComponent = computed(() => {
  switch (assetType.value) {
    case "CricketResults":
      return AssetDefaultView;
    case "CricketTop5Bowling":
      return AssetDefaultView;
    case "CricketTop5Batting":
      return AssetDefaultView;
    case "CricketLadder":
      return AssetDefaultView;
    case "CricketUpcoming":
      return AssetDefaultView;
    case "CricketResultSingle":
      return Weekendsinglegameresult;
    case "CricketRoster":
      return Rosterposter;
    default:
      return null;
  }
});

/* function navigateToEdit() {
  console.log("Navigating with params:", {
    accountid: route.params.accountid,
    sport: route.params.sport,
    renderid: route.params.renderid,
    groupingcategory: route.params.groupingcategory,
    asset: route.params.asset,
  });
  router.push({
    name: "processEdit",
    query: {
      accountid: route.params.accountid,
      sport: route.params.sport,
      renderid: route.params.renderid,
      groupingcategory: route.params.groupingcategory,
      asset: route.params.asset,
    },
  });
} */
</script>
