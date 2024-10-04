import axios from "axios";

// API call to trigger a rerender
export const triggerRerenderAPI = async (asset) => {
  try {
    const response = await axios.post("/api/rerender", {
      assetId: asset.id,
      assetType: asset.category,
      renderID: asset.renderID,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to trigger rerender.");
  }
};

// Polling function to check the rerender status
export const pollRerenderStatus = async (asset) => {
  try {
    const response = await axios.get(`/api/rerender/status/${asset.renderID}`);
    return response.data; // This should include hasBeenProcessed, hasError, etc.
  } catch (error) {
    throw new Error("Failed to poll rerender status.");
  }
};
