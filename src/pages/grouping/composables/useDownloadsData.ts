import { computed } from "vue";
import { useDownloadsStore } from "@/store/downloads";
import { storeToRefs } from "pinia";

export function useDownloadsData(groupingCategory: string | number) {
  const downloadsStore = useDownloadsStore();
  const { downloadDetails, downloadsByRender, loading, error } =
    storeToRefs(downloadsStore);

  // Fetch downloads by render ID
  async function fetchDownloadsByRenderId(renderId: number) {
    try {
      await downloadsStore.fetchDownloadsByRenderId(renderId);
    } catch (err) {
      console.error("Failed to fetch downloads by render ID:", err);
    }
  }

  // Filter downloads by grouping category
  const downloadsByGroupingCategory = computed(() => {
    return downloadsByRender.value.filter((download) => {
      const category = download.attributes.grouping_category
        ? download.attributes.grouping_category.toLowerCase()
        : "unknown";
      return category === groupingCategory;
    });
  });

  // Get the total number of downloads for the specified grouping category
  const getTotalDownloads = computed(() => {
    return downloadsByGroupingCategory.value.length;
  });

  // Get the URLs for the digital assets for the specified grouping category
  const getDigitalAssetLinks = computed(() => {
    return downloadsByGroupingCategory.value.flatMap((download) =>
      Array.isArray(download.attributes.downloads)
        ? download.attributes.downloads.map((d) => d.url)
        : []
    );
  });

  // Group downloads by asset type for the specified grouping category
  const getDownloadsGroupedByType = computed(() => {
    const grouped = downloadsByGroupingCategory.value.reduce(
      (acc, download) => {
        const type =
          download.attributes.asset?.data?.attributes?.CompositionID ||
          "Unknown";
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(download);
        return acc;
      },
      {} as Record<string, any[]>
    );
    return grouped;
  });

  // Group downloads by asset category for the specified grouping category
  const getDownloadsGroupedByCategory = computed(() => {
    const grouped = downloadsByGroupingCategory.value.reduce(
      (acc, download) => {
        const category =
          download.attributes.asset_category?.data?.attributes?.Identifier ||
          "Unknown";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(download);
        return acc;
      },
      {} as Record<string, any[]>
    );
    return grouped;
  });

  // Check for errors in the downloads
  const checkBundleErrors = computed(() => {
    const errors = downloadsByGroupingCategory.value.reduce(
      (acc, download) => {
        if (download.attributes.hasError) {
          acc.assets.push({
            id: download.id,
            name: download.attributes.Name,
            error: download.attributes.UserErrorMessage || "Unknown Error",
          });
        }
        return acc;
      },
      { value: false, assets: [] } as {
        value: boolean;
        assets: { id: number; name: string; error: string }[];
      }
    );
    errors.value = errors.assets.length > 0;
    return errors;
  });

  // Create an object to categorize the stats for the specified grouping category
  const downloadStats = computed(() => {
    return {
      totalDownloads: getTotalDownloads.value,
      downloadsGroupedByType: Object.keys(getDownloadsGroupedByType.value).map(
        (type) => ({
          type,
          count: getDownloadsGroupedByType.value[type].length,
        })
      ),
      downloadsGroupedByCategory: Object.keys(
        getDownloadsGroupedByCategory.value
      ).map((category) => ({
        category,
        count: getDownloadsGroupedByCategory.value[category].length,
      })),
    };
  });

  return {
    downloadDetails,
    downloadsByGroupingCategory,
    loading,
    error,
    fetchDownloadsByRenderId,
    getTotalDownloads,
    getDigitalAssetLinks,
    getDownloadsGroupedByType,
    getDownloadsGroupedByCategory,
    downloadStats,
    checkBundleErrors,
  };
}
