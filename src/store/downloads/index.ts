import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useDownloadsStore = defineStore("downloads", () => {
  return { ...actions, ...getters };
});
