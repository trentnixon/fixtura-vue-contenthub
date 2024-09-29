import { defineStore } from "pinia";
import { GameMetaData } from "@/types";

export interface PrivateGameMetaDatasState {
  gameMetaData: GameMetaData | null;
  gameMetaDatas: GameMetaData[];
  loading: boolean;
  error: string | null;
}

export const usePrivateGameMetaDatasState = defineStore(
  "gameMetaDatas-private",
  {
    state: (): PrivateGameMetaDatasState => ({
      gameMetaData: null,
      gameMetaDatas: [],
      loading: false,
      error: null,
    }),
  }
);
