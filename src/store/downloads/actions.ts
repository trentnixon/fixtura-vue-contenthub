import { usePrivateDownloadState } from "./private";
import {
  fetchDownloadFromService,
  fetchDownloadsByRenderIdFromService,
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
    const responses = await Promise.all(ids.map(id => fetchDownloadFromService(id)));

    // Store each download in `fullDownloads` by its ID
    responses.forEach(response => {
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