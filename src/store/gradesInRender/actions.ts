import { usePrivateGradesInRenderState } from "./private";
import { fetchGradesByRenderIdFromService } from "./service";

export async function fetchGradesByRenderId(renderId: number) {
  const state = usePrivateGradesInRenderState();
  try {
    state.loading = true;
    const response = await fetchGradesByRenderIdFromService(renderId);
    if (response && response.data) {
      state.gradesInRenderByRenderID = response.data;
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
