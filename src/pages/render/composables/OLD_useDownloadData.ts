import { computed } from "vue";
import { useDownloadsStore } from "@/store/downloads";
import { storeToRefs } from "pinia";

export function useDownloadData() {
  const downloadsStore = useDownloadsStore();
  const { downloadDetails, downloadsByRender, loading, error } =
    storeToRefs(downloadsStore);

  // Fetch a single download by ID
  async function fetchDownloadById(id: number) {
    try {
      await downloadsStore.fetchDownload(id);
    } catch (err) {
      console.error("Failed to fetch download:", err);
    }
  }

  // Fetch downloads by render ID
  async function fetchDownloadsByRenderId(renderId: number) {
    try {
      await downloadsStore.fetchDownloadsByRenderId(renderId);
    } catch (err) {
      console.error("Failed to fetch downloads by render ID:", err);
    }
  }

  // Get download details by ID
  const getDownloadById = (id: number) => {
    return (
      downloadsByRender.value.find((download) => download.id === id) || null
    );
  };

  // Get the total number of downloads for the render
  const getTotalDownloads = computed(() => {
    return downloadsByRender.value.length;
  });

  // Get the URLs for the digital assets
  const getDigitalAssetLinks = computed(() => {
    return downloadsByRender.value.flatMap((download) =>
      Array.isArray(download.attributes.downloads)
        ? download.attributes.downloads.map((d: { url: string }) => d.url)
        : []
    );
  });

  // Group downloads by asset type
  const getDownloadsGroupedByType = computed(() => {
    const grouped = downloadsByRender.value.reduce((acc, download) => {
      const type =
        download.attributes.OBJ.VIDEOMETA.Video.CompositionID || "Unknown";

      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(download);
      return acc;
    }, {} as Record<string, any[]>);

    return grouped;
  });

  // Group downloads by asset category
  const getDownloadsGroupedByCategory = computed(() => {
    const grouped = downloadsByRender.value.reduce((acc, download) => {
      const category =
        download.attributes?.asset_category?.data?.attributes?.Name ||
        "Unknown";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(download);
      return acc;
    }, {} as Record<string, any[]>);

    return grouped;
  });

  // Get the grouping category for downloads
  const getGroupingCategory = computed(() => {
    return downloadsByRender.value.map(
      (download) => download.attributes.grouping_category || "Unknown"
    );
  });

  // New: Function to check for errors in the bundle
  const checkBundleErrors = computed(() => {
    const errors = downloadsByRender.value.reduce(
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

  // New: Create an object to categorize the stats
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
      groupingCategory: getGroupingCategory.value.reduce((acc, category) => {
        if (!acc[category]) acc[category] = 0;
        acc[category]++;
        return acc;
      }, {} as Record<string, number>),
      groupingCategories: Array.from(new Set(getGroupingCategory.value)),
    };
  });

  return {
    downloadDetails,
    downloadsByRender,
    loading,
    error,
    fetchDownloadById,
    fetchDownloadsByRenderId,
    getDownloadById,
    getTotalDownloads,
    getDigitalAssetLinks,
    getDownloadsGroupedByType,
    getDownloadsGroupedByCategory,
    getGroupingCategory,
    downloadStats,
    checkBundleErrors,
  };
}
