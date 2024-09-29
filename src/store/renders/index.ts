import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useRendersStore = defineStore("renders", () => {
  return { ...actions, ...getters };
});
