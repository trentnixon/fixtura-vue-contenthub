/* eslint-disable @typescript-eslint/no-unused-vars */
import { computed } from "vue";
import { useDownloadsData } from "./OLD_useDownloadsData";
import { useAiArticlesData } from "./OLD_useAiArticlesData";

export function useGroupedAssetsData(
  groupingCategory: string | number,
  renderId: number
) {
  // Get the data from downloads and AI articles composables
  const {
    downloadDetails,
    downloadsByGroupingCategory,
    loading: downloadsLoading,
    error: downloadsError,
    fetchDownloadsByRenderId,
    getTotalDownloads,
    getDigitalAssetLinks,
    getDownloadsGroupedByType,
    getDownloadsGroupedByCategory,
    downloadStats,
    checkBundleErrors,
  } = useDownloadsData(groupingCategory);

  const {
    aiArticlesByGroupingCategory,
    loading: aiArticlesLoading,
    error: aiArticlesError,
    fetchAiArticlesByRenderId,
  } = useAiArticlesData(groupingCategory);

  // Group asset types, asset IDs, assetLinkID, and ASSETCATEGORYID
  const getAssetTypeWithIds = computed(() => {
    // First, group the downloads by asset type, assetLinkID, and assetCategoryID
    const groupedAssets = downloadsByGroupingCategory.value.reduce(
      (acc, download) => {
        const type =
          download.attributes.asset?.data?.attributes?.CompositionID ||
          "Unknown";
        const assetId = download.id;
        const assetLinkID = download.attributes.assetLinkID || "Unknown";
        const assetCategoryID =
          download.attributes.asset_category?.data?.attributes?.Identifier ||
          "Unknown";

        if (!acc[assetLinkID]) {
          acc[assetLinkID] = {
            assetLinkID, // Push assetLinkID to the root
            type,
            assetCategoryID,
            downloads: [],
            aiArticles: [],
          };
        }

        acc[assetLinkID].downloads.push({
          assetId,
          assetLinkID,
          assetCategoryID,
        });

        return acc;
      },
      {} as Record<
        string,
        {
          assetLinkID: string;
          type: string;
          assetCategoryID: string | number;
          downloads: {
            assetId: number;
            assetLinkID: string;
            assetCategoryID: string | number;
          }[];
          aiArticles: {
            articleId: number;
            articleName: string;
            articleLinkID: string;
            articleCategoryID: string | number;
          }[];
        }
      >
    );

    // Now, group AI articles by assetLinkID and merge them into the groupedAssets
    aiArticlesByGroupingCategory.value.forEach((article) => {
      const assetLinkID = article.attributes.assetLinkID || "Unknown";
      const assetCategoryID =
        article.attributes.asset_category?.data?.attributes?.Identifier ||
        "Unknown";
      const articleId = article.id;
      const articleName = article.attributes.Name;

      if (!groupedAssets[assetLinkID]) {
        groupedAssets[assetLinkID] = {
          assetLinkID, // Push assetLinkID to the root
          type:
            article.attributes.asset?.data?.attributes?.CompositionID ||
            "Unknown",
          assetCategoryID,
          downloads: [],
          aiArticles: [],
        };
      }

      groupedAssets[assetLinkID].aiArticles.push({
        articleId,
        articleName,
        articleLinkID: assetLinkID,
        articleCategoryID: assetCategoryID,
      });
    });

    // Convert the grouped object into an array of objects for easier handling in components
    return Object.keys(groupedAssets).map((assetLinkID) => ({
      assetLinkID,
      type: groupedAssets[assetLinkID].type,
      assetCategoryID: groupedAssets[assetLinkID].assetCategoryID,
      downloads: groupedAssets[assetLinkID].downloads,
      aiArticles: groupedAssets[assetLinkID].aiArticles,
    }));
  });

  return {
    fetchDownloadsByRenderId,
    fetchAiArticlesByRenderId,
    getAssetTypeWithIds,
    downloadsLoading,
    downloadsError,
    aiArticlesLoading,
    aiArticlesError,
    downloadStats,
    checkBundleErrors,
    getTotalDownloads,
    getDigitalAssetLinks,
    getDownloadsGroupedByType,
    getDownloadsGroupedByCategory,
    downloadDetails,
  };
}
