import { usePrivateTeamState } from "./private";
import { fetchTeamFromService, fetchTeamsByClubIdFromService } from "./service";

export async function fetchTeam(id: number) {
  const state = usePrivateTeamState();
  try {
    state.loading = true;
    const response = await fetchTeamFromService(id);
    if (response && response.data) {
      state.team = response.data;
      //console.log("Fetched team details:", state.team);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchTeamsByClubId(clubId: number) {
  const state = usePrivateTeamState();
  try {
    state.loading = true;
    const response = await fetchTeamsByClubIdFromService(clubId);
    if (response && response.data) {
      state.teams = response.data;
      //console.log("Fetched teams for club ID:", clubId, state.teams);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
