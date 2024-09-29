import { computed } from "vue";
import { usePrivateTeamState } from "./private";

export const team = computed(() => usePrivateTeamState().team);
export const teams = computed(() => usePrivateTeamState().teams);
export const loading = computed(() => usePrivateTeamState().loading);
export const error = computed(() => usePrivateTeamState().error);

export const getTeamById = computed(() => (id: number) => {
  return teams.value.find((team) => team.id === id) || null;
});
