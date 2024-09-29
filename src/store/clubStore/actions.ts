import { usePrivateClubState } from "./private";
import fetcher from "@/actions/fetcher";
import { Club } from "@/types";

export async function fetchClub(id: number) {
  const state = usePrivateClubState();
  state.loading = true;
  state.error = null;
  try {
    const response = await fetcher.get<{ data: Club }>(
      `/clubs/${id}?populate=*`
    );
    if (response && response.data) {
      state.club = response.data;
      //console.log("Fetched club details:", state.club);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export function setClub(club: { id: number }) {
  fetchClub(club.id);
}
