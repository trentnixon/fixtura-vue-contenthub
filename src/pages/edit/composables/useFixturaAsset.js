import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDownloadsStore } from "@/store/downloads";
import { useAccountStore } from "@/store/account";
import { useRenderAssets } from "@/pages/asset/composables/useRenderAssets";
import { useRoute } from "vue-router";

export function useFetchFixturaAsset() {
  const downloadsStore = useDownloadsStore();
  const accountStore = useAccountStore();
  const { selectedFixturaAsset } = useRenderAssets();
  const { getDownloadData } = storeToRefs(downloadsStore);
  const route = useRoute();
  console.log("[route]", route.params);
  // Computed property to get dataObj for editing
  const dataObj = computed(() => getDownloadData.value?.dataObj);
  const isFetching = ref(false);
  const assetLinkID = computed(
    () => Object.keys(selectedFixturaAsset.value)[0]
  );

  // Fetch asset data by assetLinkID
  async function fetchAssetData() {
    console.log("[fetchAssetData]", assetLinkID.value);
    isFetching.value = true;
    if (assetLinkID.value) {
      await downloadsStore.fetchAssetByLinkID(assetLinkID.value);
      await accountStore.fetchAccountMediaLibraryAction(route.params.accountid);
      isFetching.value = false;
    } else {
      isFetching.value = false;
      console.warn("No valid assetLinkID found in selectedFixturaAsset.");
    }
  }

  // Watch for changes in selectedFixturaAsset and re-fetch as needed
  watch(selectedFixturaAsset, () => {
    fetchAssetData();
  });

  return {
    fetchAssetData,
    dataObj,
    isFetching: computed(() => isFetching.value),
  };
}
