import { usePrivateCompetitionState } from "./private";
import {
  fetchCompetitionFromService,
  fetchCompetitionsFromService,
} from "./service";
import { Competition } from "@/types";

export async function fetchCompetition(id: number) {
  const state = usePrivateCompetitionState();
  try {
    state.loading = true;
    const response = await fetchCompetitionFromService(id);
    if (response && response.data) {
      state.competition = response.data as Competition;
      //console.log("Fetched competition details:", state.competition);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchCompetitions() {
  const state = usePrivateCompetitionState();
  try {
    state.loading = true;
    const response = await fetchCompetitionsFromService();
    if (response && response.data) {
      state.competitions = response.data as Competition[];
      //console.log("Fetched competitions:", state.competitions);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
