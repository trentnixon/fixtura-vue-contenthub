import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useDataCollectionStore = defineStore("dataCollection", () => {
  return { ...actions, ...getters };
});
