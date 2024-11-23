import { useRendersStore } from "@/store/renders"; // Import the Pinia store
import { storeToRefs } from "pinia";

export function useRenderAssets() {
  const rendersStore = useRendersStore(); // Access the renders store
  //
  const { selectedFixturaAsset } = storeToRefs(rendersStore);
  // Reactive properties to track loading and errors
  /*   const loading = computed(() => rendersStore.loading);
  const error = computed(() => rendersStore.error); */

  return {
    selectedFixturaAsset,
  };
}
