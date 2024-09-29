// store/accountMediaLibrary/index.ts
import { defineStore } from "pinia";
import * as actions from "./actions";
import * as getters from "./getters";

export const useAccountMediaLibraryStore = defineStore(
  "accountMediaLibrary",
  () => {
    return {
      ...actions,
      ...getters,
    };
  }
);
