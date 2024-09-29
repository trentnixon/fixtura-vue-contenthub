import { usePrivateClubToCompetitionState } from "./private";
import {
  fetchClubToCompetitionFromService,
  fetchClubToCompetitionsByClubIdFromService,
} from "./service";
import { ClubToCompetition } from "@/types";

export async function fetchClubToCompetition(id: number) {
  const state = usePrivateClubToCompetitionState();
  try {
    state.loading = true;
    const response = await fetchClubToCompetitionFromService(id);
    if (response && response.data) {
      state.clubToCompetition = response.data as ClubToCompetition;
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchClubToCompetitionsByClubId(clubId: number) {
  const state = usePrivateClubToCompetitionState();
  try {
    state.loading = true;
    const response = await fetchClubToCompetitionsByClubIdFromService(clubId);
    if (response && response.data) {
      state.clubToCompetitions = response.data as ClubToCompetition[];
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
