import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useClubToCompetitionsStore = defineStore(
  "clubToCompetitions",
  () => {
    return { ...actions, ...getters };
  }
);
