import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useAccountStore = defineStore("account", () => {
  return { ...actions, ...getters };
});
