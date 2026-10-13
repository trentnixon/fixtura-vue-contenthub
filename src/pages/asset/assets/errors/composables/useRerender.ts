import { ref, Ref } from "vue";
import { useDownloadsStore } from "@/store/downloads";
import { useRendersStore } from "@/store/renders";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import type { Download } from "@/types";

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
  let pollTimeout: number | undefined;

  const routeParams = useRouteParams();

  /**
   * Polls the download status of an asset.
   * A baseline is the record from before this rerender. An already processed
   * asset must change, or pass through an in-progress flag, before it counts
   * as finished. Without a baseline, processed means the first render is done.
   */
  const pollDownloadStatus = async (
    assetId: number,
    options?: { baseline: DownloadSnapshot | null },
    maxAttempts = 20
  ): Promise<boolean> => {
    let attempts = 0;
    let sawInProgress = false;
    const requireChange = options !== undefined;
    const baseline = options?.baseline ?? null;

    try {
      while (attempts < maxAttempts) {
        await delay(pollInterval);
        await downloadsStore.fetchDownload(assetId);
        const snapshot = readDownloadSnapshot(downloadDetails.value);

        if (!snapshot.hasBeenProcessed || snapshot.forceRerender) {
          sawInProgress = true;
        }

        if (
          rerenderFinished(snapshot, baseline, sawInProgress, requireChange)
        ) {
          return true;
        }

        attempts++;
      }

      throw new Error("Max polling attempts reached");
    } catch (error) {
      handleError(error, "Error checking download status");
      return false;
    } finally {
      clearTimeout(pollTimeout);
    }
  };

  /**
   * Triggers the rerender process for an asset.
   * isPolling is local to this composable, so only the clicked asset skeletons.
   */
  const triggerRerender = async (asset: AssetType): Promise<boolean> => {
    rerenderError.value = null;
    isPolling.value = true;

    try {
      await downloadsStore.fetchDownload(asset.id);
      const fetched = downloadDetails.value;
      const baseline =
        fetched?.id === asset.id ? readDownloadSnapshot(fetched) : null;

      await downloadsStore.triggerRerender(asset.id, {
        account_id: routeParams.accountId.value,
        render_id: routeParams.renderId.value,
      });

      if (!rerenderResponse.value?.success) return false;

      const finished = await pollDownloadStatus(asset.id, { baseline });
      if (finished) await refreshAssets(false);
      return finished;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      isPolling.value = false;
    }
  };

  /**
   * Performs a one-time poll of the download status
   */
  const oneTimePollDownloadStatus = async (assetId: number) => {
    isPolling.value = true;
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
   * Refreshes the assets in the UI.
   * Apply Edits passes false so the page spinner does not unmount the skeleton.
   */
  const refreshAssets = async (showLoading = true) => {
    const { accountId, renderId, groupingCategory, assetType } = routeParams;
    await rendersStore.fetchAssetsByRenderAction(
      accountId.value,
      renderId.value,
      groupingCategory.value,
      assetType.value,
      showLoading
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
      pollTimeout = window.setTimeout(resolve, ms);
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

interface DownloadSnapshot {
  updatedAt: string | null;
  hasBeenProcessed: boolean;
  forceRerender: boolean;
}

function readDownloadSnapshot(asset: Download | null): DownloadSnapshot {
  const attributes = asset?.attributes;
  return {
    updatedAt: attributes?.updatedAt ?? null,
    hasBeenProcessed: Boolean(attributes?.hasBeenProcessed),
    forceRerender: Boolean(attributes?.forceRerender),
  };
}

function rerenderFinished(
  current: DownloadSnapshot,
  baseline: DownloadSnapshot | null,
  sawInProgress: boolean,
  requireChange: boolean
): boolean {
  const settled = current.hasBeenProcessed && !current.forceRerender;
  if (!settled) return false;
  if (!requireChange) return true;
  if (sawInProgress) return true;
  if (!baseline?.updatedAt || !current.updatedAt) return false;
  return current.updatedAt !== baseline.updatedAt;
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
    groupingCategory: ref(
      decodeURIComponent(String(route.params.groupingcategory))
    ),
    assetType: ref(String(route.params.asset)),
  };
}
