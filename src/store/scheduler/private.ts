import { Scheduler } from "@/types";
import { defineStore } from "pinia";

export interface PrivateSchedulerState {
  scheduler: Scheduler | null;
  loading: boolean;
  error: string | null;
}

export const usePrivateSchedulerState = defineStore("scheduler-private", {
  state: (): PrivateSchedulerState => ({
    scheduler: null, // Initially null until data is fetched
    loading: false, // Initially false
    error: null, // Initially no error
  }),
  actions: {
    $reset() {
      // Reset the state to the initial values
      this.scheduler = null;
      this.loading = false;
      this.error = null;
    },
  },
});
