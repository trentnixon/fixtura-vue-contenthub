import { usePrivateRendersState } from "./private";
import { fetchRenderFromService } from "./service";

// Action to fetch a single render by its ID
export async function fetchRenderById(id: number) {
  const state = usePrivateRendersState();
  try {
    state.loading = true;
    const response = await fetchRenderFromService(id);
    if (response && response.data) {
      state.selectedRender = response.data;
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
