import { defineStore } from "pinia";
import * as getters from "./getters";
import * as actions from "./actions";
export const useGameDataNetballStore = defineStore("gameDataNetball", () => {
  return { ...actions, ...getters };
});
