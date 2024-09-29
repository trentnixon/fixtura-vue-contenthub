import { computed } from "vue";
import { usePrivateResultCollectionState } from "./private";

export const resultCollections = computed(
  () => usePrivateResultCollectionState().resultCollections
);
export const accountResultCollections = computed(
  () => usePrivateResultCollectionState().accountResultCollections
);
export const resultCollectionDetails = computed(
  () => usePrivateResultCollectionState().resultCollectionDetails
);
export const loading = computed(
  () => usePrivateResultCollectionState().loading
);
export const error = computed(() => usePrivateResultCollectionState().error);

export const resultCollectionCount = computed(
  () => resultCollections.value.length
);
export const accountResultCollectionCount = computed(
  () => accountResultCollections.value.length
);
export const firstTenCollections = computed(() =>
  resultCollections.value.slice(0, 10)
);
export const collectionsCount = computed(() => resultCollections.value.length);
