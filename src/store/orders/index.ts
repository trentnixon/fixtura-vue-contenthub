import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useOrdersStore = defineStore("orders", () => {
  return { ...actions, ...getters };
});
