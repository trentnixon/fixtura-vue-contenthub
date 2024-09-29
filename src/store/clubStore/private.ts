import { defineStore } from "pinia";
import { Club } from "@/types";

export interface PrivateClubState {
  club: Club | null;
  loading: boolean;
  error: string | null;
}

export const usePrivateClubState = defineStore("club-private", {
  state: (): PrivateClubState => ({
    club: null,
    loading: false,
    error: null,
  }),
});
