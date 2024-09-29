import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useGameResultsInRenderStore = defineStore(
  "gameResultsInRender",
  () => {
    return { ...actions, ...getters };
  }
);
