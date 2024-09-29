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