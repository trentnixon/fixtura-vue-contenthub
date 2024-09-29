import { usePrivateUpcomingGamesInRenderState } from "./private";
import { fetchUpcomingGamesByRenderIdFromService } from "./service";

export async function fetchUpcomingGamesByRenderId(renderId: number) {
  const state = usePrivateUpcomingGamesInRenderState();
  try {
    state.loading = true;
    const response = await fetchUpcomingGamesByRenderIdFromService(renderId);
    if (response && response.data) {
      state.upcomingGamesInRenderByRenderID = response.data;
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
