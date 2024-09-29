import { computed } from "vue";
import { usePrivateGameResultsInRenderState } from "./private";

export const gameResultsInRender = computed(() => usePrivateGameResultsInRenderState().gameResultsInRender);
export const gameResultsInRenderByRenderID = computed(
  () => usePrivateGameResultsInRenderState().gameResultsInRenderByRenderID
);
export const loading = computed(() => usePrivateGameResultsInRenderState().loading);
export const error = computed(() => usePrivateGameResultsInRenderState().error);
