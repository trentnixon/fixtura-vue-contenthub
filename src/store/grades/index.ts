import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useGradesStore = defineStore("grades", () => {
  return { ...actions, ...getters };
});
