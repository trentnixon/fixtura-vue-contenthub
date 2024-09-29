import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useCustomerStore = defineStore("customer", () => {
  return { ...actions, ...getters };
});
