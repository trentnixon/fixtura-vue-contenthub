import { defineStore } from "pinia";
import { GameDataNetball } from "@/types";

export interface PrivateGameDataNetballState {
  gameDataNetball: GameDataNetball | null;
  gameDataNetballs: GameDataNetball[];
  loading: boolean;
  error: string | null;
}

export const usePrivateGameDataNetballState = defineStore(
  "gameDataNetball-private",
  {
    state: (): PrivateGameDataNetballState => ({
      gameDataNetball: null,
      gameDataNetballs: [],
      loading: false,
      error: null,
    }),
  }
);
