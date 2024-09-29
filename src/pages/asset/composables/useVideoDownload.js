// src/composables/useVideoDownload.js
import { ref } from "vue";

export function useVideoDownload() {
  const isDownloading = ref(false);
  const downloadError = ref(null);

  // Function to download a single video as a blob
  async function downloadVideo(url) {
    isDownloading.value = true;
    downloadError.value = null;

    try {
      const response = await fetch(url, {
        mode: "cors", // Ensure CORS is handled
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
      URL.revokeObjectURL(blobUrl); // Clean up
    } catch (error) {
      console.error("Download failed:", error);
      downloadError.value = "Failed to download video. Please try again.";
    } finally {
      isDownloading.value = false;
    }
  }

  // Helper to extract the filename from the URL
  function getFilenameFromUrl(url) {
    return url.substring(url.lastIndexOf("/") + 1) || "video.mp4";
  }

  return {
    isDownloading,
    downloadVideo,
    downloadError,
  };
}
