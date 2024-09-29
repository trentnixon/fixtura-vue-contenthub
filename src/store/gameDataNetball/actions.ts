import { usePrivateGameDataNetballState } from "./private";
import {
  fetchGameDataNetballFromService,
  fetchGameDataNetballsFromService,
} from "./service";
import { GameDataNetball } from "@/types";

export async function fetchGameDataNetball(id: number) {
  const state = usePrivateGameDataNetballState();
  try {
    state.loading = true;
    const response = await fetchGameDataNetballFromService(id);
    if (response && response.data) {
      state.gameDataNetball = response.data as GameDataNetball;
      //console.log("Fetched game data netball details:", state.gameDataNetball);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchGameDataNetballs() {
  const state = usePrivateGameDataNetballState();
  try {
    state.loading = true;
    const response = await fetchGameDataNetballsFromService();
    if (response && response.data) {
      state.gameDataNetballs = response.data as GameDataNetball[];
      //console.log("Fetched game data netballs:", state.gameDataNetballs);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
