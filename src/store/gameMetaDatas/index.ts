import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useGameMetaDatasStore = defineStore("gameMetaDatas", () => {
  return { ...actions, ...getters };
});
