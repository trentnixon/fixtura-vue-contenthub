import { usePrivateGameDataAFLState } from "./private";
import {
  fetchGameDataAFLFromService,
  fetchGameDataAFLsFromService,
} from "./service";
import { GameDataAFL } from "@/types";

export async function fetchGameDataAFL(id: number) {
  const state = usePrivateGameDataAFLState();
  try {
    state.loading = true;
    const response = await fetchGameDataAFLFromService(id);
    if (response && response.data) {
      state.gameDataAFL = response.data as GameDataAFL;
      //console.log("Fetched game data AFL details:", state.gameDataAFL);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchGameDataAFLs() {
  const state = usePrivateGameDataAFLState();
  try {
    state.loading = true;
    const response = await fetchGameDataAFLsFromService();
    if (response && response.data) {
      state.gameDataAFLs = response.data as GameDataAFL[];
      //console.log("Fetched game data AFLs:", state.gameDataAFLs);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
