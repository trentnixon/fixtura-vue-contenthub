import { defineStore } from "pinia";
import { GameResultsInRender } from "@/types";

interface PrivateGameResultsInRenderState {
  gameResultsInRender: GameResultsInRender | null;
  gameResultsInRenderByRenderID: GameResultsInRender[];
  loading: boolean;
  error: string | null;
}

export const usePrivateGameResultsInRenderState = defineStore("gameResultsInRender-private", {
  state: (): PrivateGameResultsInRenderState => ({
    gameResultsInRender: null,
    gameResultsInRenderByRenderID: [],
    loading: false,
    error: null,
  }),
});
