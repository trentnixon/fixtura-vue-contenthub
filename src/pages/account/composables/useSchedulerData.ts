// src/pages/scheduler/composables/useSchedulerData.ts
import { computed } from "vue";
import { useSchedulerStore } from "@/store/scheduler";
import { Scheduler } from "@/types";

export function useSchedulerData() {
  const schedulerStore = useSchedulerStore(); // Initialize the scheduler store

  // Destructure the store methods and getters directly
  const { scheduler, schedulerRef, fetchScheduler, loading, error } =
    schedulerStore;

  // Fetch the scheduler by ID
  async function fetchSchedulerById(id: number) {
    console.log(`[fetchSchedulerById] Fetching scheduler with ID: ${id}`);
    try {
      await fetchScheduler(id); // Fetch scheduler using the action from the store
      console.log(`[fetchSchedulerById] Scheduler fetched successfully.`);
      console.log("Scheduler Data after fetch:", scheduler.value); // Log the value after fetch
    } catch (err) {
      console.error("[fetchSchedulerById] Failed to fetch scheduler:", err);
    }
  }

  // Computed property for renders
  // Computed property for renders (use schedulerRef directly)
  const renders = computed(() => {
    console.log("Scheduler in renders computed:", scheduler.value); // Remove toValue, use scheduler.value directly
    return scheduler.value?.attributes?.renders?.data || []; // Optional chaining to handle null or undefined
  });

  // Computed property for scheduler name
  const getSchedulerName = computed(() => {
    return scheduler.value?.attributes?.Name || "Unknown Scheduler"; // Optional chaining
  });

  // Computed property for queued status
  const getSchedulerQueuedStatus = computed(() => {
    return scheduler.value?.attributes?.Queued || "Unknown Status"; // Optional chaining
  });

  // Computed property for rendering status
  const getSchedulerisRenderingStatus = computed(() => {
    return scheduler.value?.attributes?.isRendering || "Unknown Status"; // Optional chaining
  });

  return {
    fetchSchedulerById,
    renders,
    getSchedulerName,
    getSchedulerQueuedStatus,
    getSchedulerisRenderingStatus,
    loading,
    error,
  };
}
