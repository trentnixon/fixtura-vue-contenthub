import { computed } from "vue";
import { usePrivateClubState } from "./private";

export const getClub = computed(() => {
  const state = usePrivateClubState();
  return state.club;
});

export const loading = computed(() => usePrivateClubState().loading);
export const error = computed(() => usePrivateClubState().error);
