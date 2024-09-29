import { defineStore } from "pinia";
import { UpcomingGameInRender } from "@/types";

interface PrivateUpcomingGamesInRenderState {
  upcomingGameInRender: UpcomingGameInRender | null;
  upcomingGamesInRenderByRenderID: UpcomingGameInRender[];
  loading: boolean;
  error: string | null;
}

export const usePrivateUpcomingGamesInRenderState = defineStore("upcomingGamesInRender-private", {
  state: (): PrivateUpcomingGamesInRenderState => ({
    upcomingGameInRender: null,
    upcomingGamesInRenderByRenderID: [],
    loading: false,
    error: null,
  }),
});
