import { computed } from "vue";
import { useRendersStore } from "@/store/renders";
import { storeToRefs } from "pinia";
import { format } from "date-fns";

export function useRenderData() {
  const renderStore = useRendersStore();
  const { selectedRender, loading, error } = storeToRefs(renderStore);

  // Fetch the render by ID
  async function fetchRenderById(id: number) {
    try {
      await renderStore.fetchRenderById(id);
    } catch (err) {
      console.error("Failed to fetch render:", err);
    }
  }

  // Get the render name
  const getRenderName = computed(() => {
    return selectedRender.value?.attributes?.Name || "Unknown";
  });

  const getRenderTime = computed(() => {
    const renderTime = selectedRender.value?.attributes.publishedAt || null;

    if (!renderTime) {
      return { date: "Unknown", time: "Unknown" };
    }

    const formattedDate = format(new Date(renderTime), "EEE do MMM");
    const formattedTime = format(new Date(renderTime), "hh:mm a");

    return {
      date: formattedDate,
      time: formattedTime,
    };
  });

  // Get the render's processing status
  const isProcessing = computed(() => {
    return selectedRender.value?.attributes?.Processing || false;
  });

  // Get the render's completion status
  const isComplete = computed(() => {
    return selectedRender.value?.attributes?.Complete || false;
  });

  // Get email-related details
  const getEmailInfo = computed(() => {
    return {
      sendEmail: selectedRender.value?.attributes?.sendEmail || false,
      emailSent: selectedRender.value?.attributes?.EmailSent || false,
      forceRerenderEmail:
        selectedRender.value?.attributes?.forceRerenderEmail || false,
    };
  });

  // Get the team roster information
  const getTeamRosterInfo = computed(() => {
    return {
      hasRequest:
        selectedRender.value?.attributes?.hasTeamRosterRequest || false,
      hasRosters: selectedRender.value?.attributes?.hasTeamRosters || false,
      emailSent: selectedRender.value?.attributes?.hasTeamRosterEmail || false,
    };
  });

  //console.log("getRenderTime ", getRenderTime.value)
  return {
    selectedRender,
    fetchRenderById,
    getRenderName,
    isProcessing,
    isComplete,
    getEmailInfo,
    getTeamRosterInfo,
    loading,
    error,
    getRenderTime
  };
}
