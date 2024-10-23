import { defineStore, storeToRefs } from "pinia";
import { watchImmediate } from "@vueuse/core";
import { usePrivateSchedulerState } from "./private"; // Import the private state
import * as getters from "./getters"; // Import getters
import * as actions from "./actions"; // Import actions

export const useSchedulerStore = defineStore("scheduler", () => {
  const state = usePrivateSchedulerState(); // Access the private state

  const { scheduler: schedulerRef } = storeToRefs(state); // Using storeToRefs to make it reactive

  // Watch scheduler and log updates immediately
  watchImmediate(
    () => schedulerRef.value,
    (newVal) => {
      console.log("Scheduler updated");
    }
  );

  return {
    ...actions,
    ...getters,
    schedulerRef,
  };
});
