import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useGameDataAFLStore = defineStore("gameDataAFL", () => {
  return { ...actions, ...getters };
});
