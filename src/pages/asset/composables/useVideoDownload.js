// src/composables/useVideoDownload.js
import { ref } from "vue";
import { trackAssetDownloaded } from "@/lib/analytics";

export function useVideoDownload() {
  const isDownloading = ref(false);
  const downloadError = ref(null);

  async function downloadVideo(url, analyticsContext = null) {
    isDownloading.value = true;
    downloadError.value = null;

    try {
      const response = await fetch(url, {
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = getFilenameFromUrl(url);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      if (analyticsContext) {
        trackAssetDownloaded(analyticsContext);
      }
    } catch (error) {
      console.error("Download failed:", error);
      downloadError.value = "Failed to download video. Please try again.";
    } finally {
      isDownloading.value = false;
    }
  }

  function getFilenameFromUrl(url) {
    return url.substring(url.lastIndexOf("/") + 1) || "video.mp4";
  }

  return {
    isDownloading,
    downloadVideo,
    downloadError,
  };
}
