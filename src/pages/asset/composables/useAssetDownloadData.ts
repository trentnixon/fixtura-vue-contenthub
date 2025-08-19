import { computed } from "vue";
import { useRoute } from "vue-router";
import { useGroupedAssetsData } from "@/pages/grouping/composables/OLD_useGroupedAssetsData";
import { useDownloadsStore } from "@/store/downloads"; // Import Downloads Store
import { useAiArticlesStore } from "@/store/aiArticles"; // Import AI Articles Store

export function useAssetDownloadData() {
  const route = useRoute();

  // Reactive route parameters for category and asset type
  const groupingCategory = computed(
    () => String(route.params.groupingcategory) || ""
  );
  const assetType = computed(() => route.params.asset || "");
  const renderId = computed(() => Number(route.params.renderid) || 0);

  // Fetching grouped assets data using the composable for the specific category and render ID
  const {
    fetchDownloadsByRenderId,
    fetchAiArticlesByRenderId,
    downloadsLoading,
    downloadsError,
    aiArticlesLoading,
    aiArticlesError,
    getAssetTypeWithIds,
  } = useGroupedAssetsData(groupingCategory.value, renderId.value);

  // Stores for fetching full versions of assets and articles
  const downloadsStore = useDownloadsStore();
  const aiArticlesStore = useAiArticlesStore();

  // Filter assets based on the selected asset type from the route
  const selectedAsset = computed(() => {
    return getAssetTypeWithIds.value.find((asset) => {
      const normalizedAssetType = Array.isArray(assetType.value)
        ? assetType.value[0].toLowerCase() // Use the first element if it's an array
        : assetType.value.toLowerCase(); // If it's a string, just use it

      return asset.type.toLowerCase() === normalizedAssetType;
    });
  });

  // Get the filtered downloads for the specific asset type
  const getFilteredDownloads = computed(() => {
    return selectedAsset.value ? selectedAsset.value.downloads : [];
  });

  // Get the filtered AI articles for the specific asset type
  const getFilteredAiArticles = computed(() => {
    return selectedAsset.value ? selectedAsset.value.aiArticles : [];
  });

  // Get the total number of downloads and articles for the specified asset type
  const getTotalDownloads = computed(() => {
    return getFilteredDownloads.value.length;
  });

  const getTotalArticles = computed(() => {
    return getFilteredAiArticles.value.length;
  });

  // Fetch the full versions of the downloads and articles
  async function fetchFullData() {
    const downloadIds = getFilteredDownloads.value.map((d) => d.assetId);
    const articleIds = getFilteredAiArticles.value.map((a) => a.articleId);

    if (downloadIds.length > 0) {
      await downloadsStore.fetchFullDownloadsByIds(downloadIds); // New action for full downloads
    }

    if (articleIds.length > 0) {
      await aiArticlesStore.fetchFullAiArticlesByIds(articleIds); // New action for full AI articles
    }
  }

  // Get the fully fetched downloads and AI articles
  const getFullDownloads = computed(() => {
    return getFilteredDownloads.value.map((d) =>
      downloadsStore.getFullDownloadById(d.assetId)
    );
  });

  const getFullAiArticles = computed(() => {
    const fullArticles = Object.values(aiArticlesStore.getFullAiArticles());
    const selectedAssetType = selectedAsset.value?.type?.toLowerCase();

    if (!selectedAssetType) {
      console.warn("No selected asset type found.");
      return [];
    }
    // Filter articles based on both CompositionID and grouping_category
    const filteredArticles = fullArticles.filter((article) => {
      const compositionIdMatch =
        article.attributes?.asset?.data?.attributes?.CompositionID?.toLowerCase() ===
        selectedAssetType;
      const groupingCategoryMatch =
        article.attributes?.grouping_category.toLowerCase() ===
        groupingCategory.value;
      return compositionIdMatch && groupingCategoryMatch;
    });

    if (filteredArticles.length === 0) {
      console.warn(
        `No articles found for CompositionID: ${selectedAssetType} and grouping_category: ${groupingCategory.value}`
      );
      return [];
    }

    //CricketResults
    const useFilteredArticles = filteredArticles.map((article) => ({
      id: article.id,
      CompositionID: article.attributes.asset.data.attributes.CompositionID,
      grouping_category: article.attributes.grouping_category,
      structuredOutput: article.attributes?.structuredOutput || null,
    }));

    return selectedAssetType === "CricketResults"
      ? [useFilteredArticles]
      : useFilteredArticles;
  });

  // Fetch the initial data and then fetch full versions
  async function fetchData() {
    await fetchDownloadsByRenderId(renderId.value);
    await fetchAiArticlesByRenderId(renderId.value);

    // Once basic data is fetched, fetch full data
    await fetchFullData();
  }

  return {
    selectedAsset,
    getFilteredDownloads,
    getFilteredAiArticles,
    getFullDownloads,
    getFullAiArticles,
    getTotalDownloads,
    getTotalArticles,
    downloadsLoading,
    downloadsError,
    aiArticlesLoading,
    aiArticlesError,
    fetchData, // To manually trigger fetching if needed
  };
}
