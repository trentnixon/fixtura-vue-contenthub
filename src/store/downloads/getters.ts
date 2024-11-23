import { computed } from "vue";
import { usePrivateDownloadState } from "./private";

export const downloadDetails = computed(
  () => usePrivateDownloadState().download
);

export const downloadsByRender = computed(
  () => usePrivateDownloadState().downloadsByRender
);

export const loading = computed(() => usePrivateDownloadState().loading);
export const error = computed(() => usePrivateDownloadState().error);

export const getDownloadById = (id: number) => {
  return downloadsByRender.value.find((download) => download.id === id) || null;
};

export const getFullDownloadById = (id: number) => {
  return computed(() => usePrivateDownloadState().fullDownloads[id] || null);
};

// Access the rerender response
export const rerenderResponse = computed(() => {
  return usePrivateDownloadState().rerenderResponse;
});

// Check if the system is currently rerendering
export const isRerendering = computed(() => {
  return usePrivateDownloadState().isRerendering;
});

export const getDownloadData = computed(() => {
  return usePrivateDownloadState().downloadData?.data;
});
