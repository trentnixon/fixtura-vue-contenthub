import { defineStore } from "pinia";
import { Team } from "@/types";

export interface PrivateTeamState {
  team: Team | null;
  teams: Team[];
  loading: boolean;
  error: string | null;
}

export const usePrivateTeamState = defineStore("teams-private", {
  state: (): PrivateTeamState => ({
    team: null,
    teams: [],
    loading: false,
    error: null,
  }),
});
