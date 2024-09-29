import { defineStore } from "pinia";
import { Competition } from "@/types";

export interface PrivateCompetitionState {
  competition: Competition | null;
  competitions: Competition[];
  loading: boolean;
  error: string | null;
}

export const usePrivateCompetitionState = defineStore("competition-private", {
  state: (): PrivateCompetitionState => ({
    competition: null,
    competitions: [],
    loading: false,
    error: null,
  }),
});
