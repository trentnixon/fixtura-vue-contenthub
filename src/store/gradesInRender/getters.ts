import { computed } from "vue";
import { usePrivateGradesInRenderState } from "./private";

export const gradesInRender = computed(() => usePrivateGradesInRenderState().gradesInRender);
export const gradesInRenderByRenderID = computed(() => usePrivateGradesInRenderState().gradesInRenderByRenderID);
export const loading = computed(() => usePrivateGradesInRenderState().loading);
export const error = computed(() => usePrivateGradesInRenderState().error);
