import { usePrivateSchedulerState } from "./private"; // Import the private state
import { fetchSchedulerFromService } from "./service"; // Assuming this service handles API requests

// Action to fetch the scheduler by ID and update the state
export async function fetchScheduler(id: number) {
  const state = usePrivateSchedulerState(); // Access the private state

  try {
    state.loading = true; // Set loading to true
    //console.log("[Action] Loading state set to true");

    const response = await fetchSchedulerFromService(id); // Fetch scheduler data

    if (response && response.data) {
      // Directly assign the response data to `scheduler`
      state.scheduler = response.data;
      //console.log("[Action] Scheduler data set successfully:", state.scheduler);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    // Handle the error properly by casting it as Error
    if (error instanceof Error) {
      state.error = error.message; // Set error message
      console.error("[Action] Error fetching scheduler:", error.message);
    } else {
      state.error = "An unknown error occurred"; // Handle unknown errors
      console.error("[Action] Unknown error occurred");
    }
  } finally {
    state.loading = false; // Set loading to false
    //console.log("[Action] Loading state set to false");
  }
}

// Action to set the scheduler based on its ID
export function setScheduler(scheduler: { id: number }) {
  fetchScheduler(scheduler.id); // Call fetchScheduler with the given scheduler ID
}
