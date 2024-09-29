import { defineStore } from "pinia";
import { Grade } from "@/types";

export interface PrivateGradesState {
  grade: Grade | null;
  grades: Grade[];
  loading: boolean;
  error: string | null;
}

export const usePrivateGradesState = defineStore("grades-private", {
  state: (): PrivateGradesState => ({
    grade: null,
    grades: [],
    loading: false,
    error: null,
  }),
});
