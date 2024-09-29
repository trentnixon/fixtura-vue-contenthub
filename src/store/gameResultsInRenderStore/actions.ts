import { usePrivateGameResultsInRenderState } from "./private";
import { fetchGameResultsInRenderByRenderIdFromService } from "./service";

export async function fetchGameResultsInRenderByRenderId(renderId: number) {
  const state = usePrivateGameResultsInRenderState();
  try {
    state.loading = true;
    const response = await fetchGameResultsInRenderByRenderIdFromService(renderId);
    if (response && response.data) {
      state.gameResultsInRenderByRenderID = response.data;
      //console.log("Fetched game results for render ID:", renderId, state.gameResultsInRenderByRenderID);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
