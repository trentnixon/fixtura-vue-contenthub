import { computed } from "vue";

interface Asset {
  hasBeenProcessed: boolean;
  hasError: boolean;
  forceRerender: boolean;
}

export function useAssetState(asset: Asset) {
  const assetState = computed(() => {
    if (!asset) return "unknown";

    if (asset.hasError && asset.forceRerender) {
      return "rerenderFailed"; // The user tried to rerender, but it failed.
    } else if (!asset.hasBeenProcessed && asset.forceRerender) {
      return "rerendering"; // The asset is in the process of being rerendered.
    } else if (asset.hasError && !asset.forceRerender) {
      return "initialError"; // The asset encountered an error but hasn't been rerendered.
    } else if (asset.hasBeenProcessed && !asset.hasError) {
      return "processed"; // The asset has been successfully processed.
    } else {
      return "unknown";
    }
  });

  return {
    assetState,
  };
}
