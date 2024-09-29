import { usePrivateGradesState } from "./private";
import { fetchGradeFromService, fetchGradesFromService } from "./service";
import { Grade } from "@/types";

export async function fetchGrade(id: number) {
  const state = usePrivateGradesState();
  try {
    state.loading = true;
    const response = await fetchGradeFromService(id);
    if (response && response.data) {
      state.grade = response.data as Grade;
      //console.log("Fetched grade details:", state.grade);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchGrades() {
  const state = usePrivateGradesState();
  try {
    state.loading = true;
    const response = await fetchGradesFromService();
    if (response && response.data) {
      state.grades = response.data as Grade[];
      //console.log("Fetched grades:", state.grades);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
