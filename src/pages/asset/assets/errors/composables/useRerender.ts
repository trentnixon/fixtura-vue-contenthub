import { ref, Ref } from "vue";
import { useDownloadsStore } from "@/store/downloads";
import { useRendersStore } from "@/store/renders";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

interface AssetType {
  id: number;
  name: string;
}

interface RouteParams {
  accountId: Ref<number>;
  renderId: Ref<number>;
  groupingCategory: Ref<string>;
  assetType: Ref<string>;
}

/**
 * Composable for handling asset rerendering and status polling
 */
export function useAssetRerender() {
  const downloadsStore = useDownloadsStore();
  const rendersStore = useRendersStore();
  const { rerenderResponse, downloadDetails, isRerendering } =
    storeToRefs(downloadsStore);

  const isPolling = ref(false);
  const rerenderError = ref<string | null>(null);
  const pollInterval = 5000; // Poll every 5 seconds
  let pollTimeout: ReturnType<typeof setTimeout>;

  const routeParams = useRouteParams();

  /**
   * Polls the download status of an asset
   */
  const pollDownloadStatus = async (
    assetId: number,
    maxAttempts = 20
  ): Promise<boolean> => {
    let attempts = 0;
    isPolling.value = true;

    try {
      while (attempts < maxAttempts) {
        console.log(`Polling attempt ${attempts + 1}...`);

        await downloadsStore.fetchDownload(assetId);
        const asset = downloadDetails.value;

        if (asset && asset?.attributes.hasBeenProcessed) {
          console.log("Asset has been processed:", asset);
          return true;
        }

        attempts++;
        await delay(pollInterval);
      }

      throw new Error("Max polling attempts reached");
    } catch (error) {
      handleError(error, "Error checking download status");
      return false;
    } finally {
      isPolling.value = false;
      clearTimeout(pollTimeout);
    }
  };

  /**
   * Triggers the rerender process for an asset
   */
  const triggerRerender = async (asset: AssetType) => {
    rerenderError.value = null;

    try {
      await downloadsStore.triggerRerender(asset.id);

      if (rerenderResponse.value?.success) {
        await pollDownloadStatus(asset.id);
        await refreshAssets();
      }
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * Performs a one-time poll of the download status
   */
  const oneTimePollDownloadStatus = async (assetId: number) => {
    try {
      await pollDownloadStatus(assetId);
      await refreshAssets();
    } catch (error) {
      handleError(error, "Error in one-time polling");
    } finally {
      isPolling.value = false;
    }
  };

  /**
   * Refreshes the assets in the UI
   */
  const refreshAssets = async () => {
    const { accountId, renderId, groupingCategory, assetType } = routeParams;
    await rendersStore.fetchAssetsByRenderAction(
      accountId.value,
      renderId.value,
      groupingCategory.value,
      assetType.value
    );
  };

  /**
   * Handles errors by setting the rerenderError and logging to console
   */
  const handleError = (error: unknown, prefix = "") => {
    const errorMessage = `${prefix}: ${(error as Error).message}`;
    rerenderError.value = errorMessage;
    console.error(errorMessage);
  };

  /**
   * Creates a delay using a Promise and setTimeout
   */
  const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => {
      pollTimeout = setTimeout(resolve, ms);
    });
  };

  return {
    triggerRerender,
    oneTimePollDownloadStatus,
    isRerendering,
    isPolling,
    rerenderResponse,
    rerenderError,
  };
}

/**
 * Extracts and returns route parameters
 * @returns Object containing route parameters as reactive references
 */
function useRouteParams(): RouteParams {
  const route = useRoute();
  return {
    accountId: ref(Number(route.params.accountid)),
    renderId: ref(Number(route.params.renderid)),
    groupingCategory: ref(String(route.params.groupingcategory)),
    assetType: ref(String(route.params.asset)),
  };
}
