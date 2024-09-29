import { usePrivateGameMetaDatasState } from "./private";
import {
  fetchGameMetaDataFromService,
  fetchGameMetaDatasByTeamIdFromService,
} from "./service";
import { GameMetaData } from "@/types";

export async function fetchGameMetaData(id: number) {
  const state = usePrivateGameMetaDatasState();
  try {
    state.loading = true;
    const response = await fetchGameMetaDataFromService(id);
    if (response && response.data) {
      state.gameMetaData = response.data as GameMetaData;
      //console.log("Fetched game meta data details:", state.gameMetaData);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchGameMetaDatasByTeamId(teamId: number) {
  const state = usePrivateGameMetaDatasState();
  try {
    state.loading = true;
    const response = await fetchGameMetaDatasByTeamIdFromService(teamId);
    if (response && response.data) {
      state.gameMetaDatas = response.data as GameMetaData[];
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
