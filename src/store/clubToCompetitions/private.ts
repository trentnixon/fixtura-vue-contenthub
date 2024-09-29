import { defineStore } from "pinia";
import { ClubToCompetition } from "@/types";

export interface PrivateClubToCompetitionState {
  clubToCompetition: ClubToCompetition | null;
  clubToCompetitions: ClubToCompetition[];
  loading: boolean;
  error: string | null;
}

export const usePrivateClubToCompetitionState = defineStore(
  "clubToCompetition-private",
  {
    state: (): PrivateClubToCompetitionState => ({
      clubToCompetition: null,
      clubToCompetitions: [],
      loading: false,
      error: null,
    }),
  }
);
