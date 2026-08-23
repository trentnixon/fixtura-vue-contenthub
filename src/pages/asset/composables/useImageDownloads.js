// src/composables/useImageDownloads.js
import { ref } from "vue";
import JSZip from "jszip";
import { trackAssetDownloaded } from "@/lib/analytics";

export function useImageDownloads() {
  const isModalOpen = ref(false);
  const currentImage = ref("");
  const isBulkDownloading = ref(false);

  const downloadImage = async (imageUrl, analyticsContext = null) => {
    try {
      const response = await fetch(imageUrl, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image. Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const urlObject = new URL(imageUrl);
      const filename = urlObject.pathname.split("/").pop();

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      if (analyticsContext) {
        trackAssetDownloaded(analyticsContext);
      }
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  const handleBulkDownload = async (imageUrls, analyticsContext = null) => {
    isBulkDownloading.value = true;

    try {
      const zip = new JSZip();

      const downloads = imageUrls.map(async (item) => {
        const response = await fetch(item, {
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const blob = await response.blob();

        const urlObject = new URL(item);
        const filename = urlObject.pathname.split("/").pop();

        zip.file(filename, blob);
      });

      await Promise.all(downloads);

      const firstUrlObject = new URL(imageUrls[0]);
      const firstFilename = firstUrlObject.pathname.split("/").pop();
      const zipFilename =
        firstFilename.split("_").slice(0, -1).join("_") + ".zip";

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = zipFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      if (analyticsContext) {
        trackAssetDownloaded({
          ...analyticsContext,
          asset_type: "image_bulk",
        });
      }
    } catch (error) {
      console.error("Error in bulk download:", error);
    } finally {
      isBulkDownloading.value = false;
    }
  };

  const viewImage = (imageUrl) => {
    currentImage.value = imageUrl;
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
    currentImage.value = "";
  };

  return {
    isModalOpen,
    currentImage,
    isBulkDownloading,
    downloadImage,
    handleBulkDownload,
    viewImage,
    closeModal,
  };
}
