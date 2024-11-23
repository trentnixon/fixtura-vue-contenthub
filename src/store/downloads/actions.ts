import { AssetData } from "@/types/fetchAssetByLink";
import { usePrivateDownloadState } from "./private";
import {
  triggerRerenderInService,
  fetchRerenderStatusFromService,
  fetchDownloadFromService,
  fetchDownloadsByRenderIdFromService,
  updateDownloadInService,
  fetchAssetByLinkIDFromService,
} from "./service";
import { Download } from "@/types";

export async function fetchDownload(id: number) {
  const state = usePrivateDownloadState();
  try {
    state.loading = true;
    const response = await fetchDownloadFromService(id);
    if (response && response.data) {
      state.download = response.data as Download;
      //console.log("Fetched download details:", state.download);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchDownloadsByRenderId(renderId: number) {
  const state = usePrivateDownloadState();
  try {
    state.loading = true;
    const response = await fetchDownloadsByRenderIdFromService(renderId);
    if (response && response.data) {
      state.downloadsByRender = response.data as Download[];
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchFullDownloadsByIds(ids: number[]) {
  const state = usePrivateDownloadState();

  try {
    state.loading = true;

    // Fetch all downloads in parallel
    const responses = await Promise.all(
      ids.map((id) => fetchDownloadFromService(id))
    );

    // Store each download in `fullDownloads` by its ID
    responses.forEach((response) => {
      if (response && response.data) {
        state.fullDownloads[response.data.id] = response.data as Download;
      }
    });
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export interface RerenderResponse {
  success: boolean;
  message: string;
  error: string | null; // Allow the error to be null
}

// Asset render and polling
export async function triggerRerender(id: number) {
  const state = usePrivateDownloadState();

  try {
    state.loading = true;
    state.isRerendering = true; // Set the rerendering state

    // Make the API call to trigger the rerender
    const response = await triggerRerenderInService(id);
    if (response) {
      // Ensure response is treated as a single object
      state.rerenderResponse = response as unknown as RerenderResponse;
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    state.rerenderResponse = {
      success: false,
      message: "Failed to trigger rerender",
      error: (error as Error).message, // Capture the error message
    };
    console.error("Error triggering rerender:", error);
  } finally {
    state.loading = false;
    state.isRerendering = false; // Reset the rerendering state
  }
}

export interface RerenderStatus {
  hasBeenProcessed: boolean;
  hasError: boolean;
}

export async function pollRerenderStatus(
  id: number,
  pollInterval = 5000,
  maxAttempts = 20
): Promise<RerenderStatus> {
  const state = usePrivateDownloadState();
  let attempts = 0;
  state.isRerendering = true;

  try {
    while (attempts < maxAttempts) {
      const response = await fetchRerenderStatusFromService(id);

      if (response && response.data) {
        const { hasBeenProcessed, hasError } = response.data;

        if (hasBeenProcessed) {
          state.isRerendering = false;

          if (!hasError) {
            // Fetch the updated download once the rerender is successful
            await fetchDownload(id);
          }

          return { hasBeenProcessed, hasError };
        }
      }

      // Wait for the pollInterval before polling again
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      attempts++;
    }

    state.isRerendering = false;
    throw new Error("Max polling attempts reached");
  } catch (error) {
    state.error = (error as Error).message;
    console.error("Error polling rerender status:", error);
    state.isRerendering = false;
    throw new Error("Error polling rerender status: " + error);
  }
}

// Asset  Editings

// Fetch selected Fixtura asset based on provided asset ID
export async function fetchAssetByLinkID(assetLinkID: string) {
  const state = usePrivateDownloadState();
  try {
    state.loading = true;
    const response: AssetData = await fetchAssetByLinkIDFromService(
      assetLinkID
    );
    state.downloadData = response;
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

// Save updated Fixtura asset to Strapi
export async function saveFixturaAsset(downloadId: number, updatedData: any) {
  const state = usePrivateDownloadState();
  try {
    state.loading = true;

    // Update the specific download with the provided downloadId
    const response = await updateDownloadInService(downloadId, {
      data: {
        OBJ: updatedData,
        hasError: false,
        forceRerender: false,
        hasBeenEdited: true,
        editTrigger: true,
      },
    });
    if (response) {
      // Update the state for this specific download if save was successful
      console.log("[response]", response);
      //state.fullDownloads[downloadId] = response.data as Download;
    } else {
      throw new Error(`Failed to save asset with ID: ${downloadId}`);
    }
  } catch (error) {
    state.error = (error as Error).message;
    console.error("Error saving Fixtura asset:", error);
  } finally {
    state.loading = false;
  }
}
