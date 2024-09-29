import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useAssociationStore = defineStore("association", () => {
  return { ...actions, ...getters };
});
