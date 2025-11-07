import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDownloadsStore } from "@/store/downloads";
import { useAccountStore } from "@/store/account";
import { useRenderAssets } from "@/pages/asset/composables/useRenderAssets";
import { useRendersStore } from "@/store/renders";
import { useRoute } from "vue-router";

export function useFetchFixturaAsset() {
  const downloadsStore = useDownloadsStore();
  const accountStore = useAccountStore();
  const rendersStore = useRendersStore();
  const { selectedFixturaAsset } = useRenderAssets();
  const { getDownloadData } = storeToRefs(downloadsStore);
  const route = useRoute();

  // Computed property to get dataObj for editing
  const dataObj = computed(() => getDownloadData.value?.dataObj);
  const isFetching = ref(false);

  // Extract assetLinkID from the structure
  // The API returns: { assetLinkID: { downloads: [], aiArticles: [] } }
  // NOT: { assetType: { assetLinkID: { downloads: [], aiArticles: [] } } }
  const assetLinkID = computed(() => {
    if (!selectedFixturaAsset.value) return null;

    // The API returns assetLinkID directly as the first key
    // Structure: { "cbef93e4...": { downloads: [], aiArticles: [] } }
    const keys = Object.keys(selectedFixturaAsset.value);

    if (keys.length === 0) {
      console.warn(
        "[useFixturaAsset] selectedFixturaAsset is empty:",
        selectedFixturaAsset.value
      );
      return null;
    }

    // Get the first key, which is the assetLinkID
    const linkID = keys[0];
    console.log("[useFixturaAsset] Extracted assetLinkID:", linkID);

    return linkID;
  });

  // Fetch asset data by assetLinkID
  async function fetchAssetData() {
    isFetching.value = true;

    try {
      // First, ensure selectedFixturaAsset is populated from route query params
      const needsFetch =
        !selectedFixturaAsset.value ||
        Object.keys(selectedFixturaAsset.value).length === 0;

      if (
        needsFetch &&
        route.query.accountid &&
        route.query.renderid &&
        route.query.groupingcategory &&
        route.query.asset
      ) {
        console.log("[useFixturaAsset] Fetching assets from render...", {
          accountid: route.query.accountid,
          renderid: route.query.renderid,
          groupingcategory: route.query.groupingcategory,
          asset: route.query.asset
        });
        await rendersStore.fetchAssetsByRenderAction(
          Number(route.query.accountid),
          Number(route.query.renderid),
          route.query.groupingcategory,
          route.query.asset  // Pass the asset name as-is from URL
        );
        console.log(
          "[useFixturaAsset] Assets fetched:",
          selectedFixturaAsset.value
        );
      }

      // Then fetch the download data using assetLinkID
      console.log("[useFixturaAsset] assetLinkID:", assetLinkID.value);
      if (assetLinkID.value) {
        await downloadsStore.fetchAssetByLinkID(assetLinkID.value);
        await accountStore.fetchAccountMediaLibraryAction(
          route.query.accountid
        );
        console.log(
          "[useFixturaAsset] Download data fetched:",
          getDownloadData.value
        );
      } else {
        console.warn(
          "[useFixturaAsset] No valid assetLinkID found. selectedFixturaAsset:",
          selectedFixturaAsset.value,
          "route.query.asset:",
          route.query.asset
        );
      }
    } catch (error) {
      console.error("[useFixturaAsset] Error fetching asset data:", error);
    } finally {
      isFetching.value = false;
    }
  }

  // Watch for changes in selectedFixturaAsset and re-fetch as needed
  watch(selectedFixturaAsset, (newValue) => {
    if (newValue && assetLinkID.value) {
      console.log(
        "[useFixturaAsset] selectedFixturaAsset changed, refetching..."
      );
      fetchAssetData();
    }
  });

  return {
    fetchAssetData,
    dataObj,
    isFetching: computed(() => isFetching.value),
  };
}
