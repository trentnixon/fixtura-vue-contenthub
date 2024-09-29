import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";

export const useAiArticlesStore = defineStore("aiArticles", () => {
  return { ...actions, ...getters };
});
