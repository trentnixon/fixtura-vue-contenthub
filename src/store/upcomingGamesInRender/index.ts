import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useUpcomingGamesInRenderStore = defineStore("upcomingGamesInRender", () => {
  return { ...actions, ...getters };
});
