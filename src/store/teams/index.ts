import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useTeamsStore = defineStore("teams", () => {
  return { ...actions, ...getters };
});
