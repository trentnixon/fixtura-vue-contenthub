import { defineStore } from "pinia";
import { Download } from "@/types";

export interface PrivateDownloadState {
  download: Download | null;
  downloadsByRender: Download[];
  loading: boolean;
  error: string | null;
  fullDownloads: Record<number, Download>;
  isRerendering: boolean; // New state to track rerendering
  rerenderResponse: {
    success: boolean;
    message: string;
    error: string | null; // Allow the error to be null
  } | null;
}

export const usePrivateDownloadState = defineStore("downloads-private", {
  state: (): PrivateDownloadState => ({
    download: null,
    downloadsByRender: [],
    loading: false,
    error: null,
    fullDownloads: {},
    isRerendering: false,
    rerenderResponse: null,
  }),
});
