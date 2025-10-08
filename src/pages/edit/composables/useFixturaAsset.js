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
  const assetLinkID = computed(() =>
    selectedFixturaAsset.value
      ? Object.keys(selectedFixturaAsset.value)[0]
      : null
  );

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
        console.log("[useFixturaAsset] Fetching assets from render...");
        await rendersStore.fetchAssetsByRenderAction(
          Number(route.query.accountid),
          Number(route.query.renderid),
          route.query.groupingcategory,
          route.query.asset
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
          "[useFixturaAsset] No valid assetLinkID found in selectedFixturaAsset:",
          selectedFixturaAsset.value
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
