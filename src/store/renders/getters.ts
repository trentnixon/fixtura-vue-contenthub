import { computed } from "vue";
import { usePrivateRendersState } from "./private";

// Single render-related getters
export const selectedRender = computed(
  () => usePrivateRendersState().selectedRender
);
export const loading = computed(() => usePrivateRendersState().loading);
export const error = computed(() => usePrivateRendersState().error);

// Basic functional getter to get the render by ID
export const getRenderById = (id: number) => {
  return selectedRender.value?.id === id ? selectedRender.value : null;
};
