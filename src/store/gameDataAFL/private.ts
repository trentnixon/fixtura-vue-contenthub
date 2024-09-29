import { defineStore } from "pinia";
import { GameDataAFL } from "@/types";

export interface PrivateGameDataAFLState {
  gameDataAFL: GameDataAFL | null;
  gameDataAFLs: GameDataAFL[];
  loading: boolean;
  error: string | null;
}

export const usePrivateGameDataAFLState = defineStore("gameDataAFL-private", {
  state: (): PrivateGameDataAFLState => ({
    gameDataAFL: null,
    gameDataAFLs: [],
    loading: false,
    error: null,
  }),
});
