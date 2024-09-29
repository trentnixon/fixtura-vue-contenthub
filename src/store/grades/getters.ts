import { computed } from "vue";
import { usePrivateGradesState } from "./private";

export const grades = computed(() => usePrivateGradesState().grades);
export const gradeDetails = computed(() => usePrivateGradesState().grade);
export const loading = computed(() => usePrivateGradesState().loading);
export const error = computed(() => usePrivateGradesState().error);

export const getGradeById = (id: number) => {
  return grades.value.find((grade) => grade.id === id) || null;
};

export const gradeCount = computed(() => grades.value.length);
export const firstTenGrades = computed(() => grades.value.slice(0, 10));
