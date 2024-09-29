import { computed } from "vue";
import { usePrivateSchedulerState } from "./private"; // Import the private store state
import { storeToRefs } from "pinia";

// Getter for accessing the scheduler object
export const scheduler = computed(() => {
  const state = usePrivateSchedulerState(); // Access the private state
  const { scheduler } = storeToRefs(state);
  return scheduler; // Directly return the scheduler
});

// Getter for accessing the loading state
export const loading = computed(() => {
  const state = usePrivateSchedulerState();
  return state.loading; // Return loading state
});

// Getter for accessing the error state
export const error = computed(() => {
  const state = usePrivateSchedulerState();
  return state.error; // Return error state
});
