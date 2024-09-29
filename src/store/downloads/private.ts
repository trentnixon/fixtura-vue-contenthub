import { defineStore } from "pinia";
import { Download } from "@/types";

export interface PrivateDownloadState {
  download: Download | null;
  downloadsByRender: Download[];
  loading: boolean;
  error: string | null;
  fullDownloads: Record<number, Download>;
}

export const usePrivateDownloadState = defineStore("downloads-private", {
  state: (): PrivateDownloadState => ({
    download: null,
    downloadsByRender: [],
    loading: false,
    error: null,
    fullDownloads: {},
  }),
});
