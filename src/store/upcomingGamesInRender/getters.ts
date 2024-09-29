import { computed } from "vue";
import { usePrivateUpcomingGamesInRenderState } from "./private";

export const upcomingGameInRender = computed(() => usePrivateUpcomingGamesInRenderState().upcomingGameInRender);
export const upcomingGamesInRenderByRenderID = computed(() => usePrivateUpcomingGamesInRenderState().upcomingGamesInRenderByRenderID);
export const loading = computed(() => usePrivateUpcomingGamesInRenderState().loading);
export const error = computed(() => usePrivateUpcomingGamesInRenderState().error);
