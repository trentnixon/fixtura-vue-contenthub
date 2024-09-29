import { defineStore } from "pinia";
import { GradeInRender } from "@/types";

interface PrivateGradesInRenderState {
  gradesInRender: GradeInRender | null;
  gradesInRenderByRenderID: GradeInRender[];
  loading: boolean;
  error: string | null;
}

export const usePrivateGradesInRenderState = defineStore("gradesInRender-private", {
  state: (): PrivateGradesInRenderState => ({
    gradesInRender: null,
    gradesInRenderByRenderID: [],
    loading: false,
    error: null,
  }),
});
