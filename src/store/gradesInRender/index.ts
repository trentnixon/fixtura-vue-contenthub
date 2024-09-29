import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useGradesInRenderStore = defineStore("gradesInRender", () => {
  return { ...actions, ...getters };
});
