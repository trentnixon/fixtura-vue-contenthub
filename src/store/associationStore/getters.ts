import { computed } from "vue";
import { usePrivateAssociationState } from "./private";

export const getAssociation = computed(() => {
  const state = usePrivateAssociationState();
  return state.association;
});

export const loading = computed(() => usePrivateAssociationState().loading);
export const error = computed(() => usePrivateAssociationState().error);
