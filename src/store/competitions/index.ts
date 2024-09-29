import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useCompetitionsStore = defineStore("competitions", () => {
  return { ...actions, ...getters };
});
