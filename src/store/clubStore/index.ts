import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useClubStore = defineStore("club", () => {
  return { ...actions, ...getters };
});
