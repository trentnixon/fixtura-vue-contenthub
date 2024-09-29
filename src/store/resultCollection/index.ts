import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useResultCollectionStore = defineStore("resultCollection", () => {
  return { ...actions, ...getters };
});
