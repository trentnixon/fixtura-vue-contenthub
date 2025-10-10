import { ref, Ref, watchEffect } from "vue";
import { useRendersStore } from "@/store/renders";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

interface RouteParams {
  accountId: Ref<number>;
  renderId: Ref<number>;
  groupingCategory: Ref<string>;
  sport: Ref<string>;
  assetType: Ref<string>;
}

interface CreateRosterComposable {
  loading: Ref<boolean>;
  error: Ref<string | null>;
  success: Ref<boolean>;
  createRoster: () => Promise<void>;
  isPolling: Ref<boolean>;
  stopPolling: () => void;
  resumeCreationPollingIfNeeded: () => void;
}

export function useCreateRoster(): CreateRosterComposable {
  const routeParams = useRouteParams();
  const rendersStore = useRendersStore();

  const { selectedRender } = storeToRefs(rendersStore);

  // State to track the status of the create roster request
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const success = ref<boolean>(false);
  const isPolling = ref<boolean>(false);

  const pollInterval = 5000; // Poll every 5 seconds
  let pollTimeout: ReturnType<typeof setTimeout>;
  const pollingEnabled = ref<boolean>(true);

  // Function to create team roster
  const createRoster = async () => {
    if (!routeParams.renderId.value || !routeParams.groupingCategory.value) {
      error.value = "Invalid renderId or groupingCategory.";
      return;
    }

    try {
      loading.value = true;
      error.value = null;
      success.value = false;

      // Call the action to create the roster
      await rendersStore.createTeamRosterAction(
        routeParams.renderId.value,
        routeParams.groupingCategory.value
      );

      // Start polling to check if creation is complete
      await pollForCreationCompletion();
    } catch (err: any) {
      // Capture any errors
      error.value = handleError(err);
    } finally {
      // Set loading to false when request is complete
      loading.value = false;
    }
  };

  // Polling function to check if roster creation is complete
  const pollForCreationCompletion = async (
    maxAttempts = 50
  ): Promise<boolean> => {
    let attempts = 0;
    isPolling.value = true;
    pollingEnabled.value = true;

    try {
      while (attempts < maxAttempts && pollingEnabled.value) {
        // Fetch the render details to check the `isCreatingRoster` flag
        await rendersStore.fetchFixturaRenderById(
          routeParams.accountId.value,
          routeParams.renderId.value,
          false
        );

        // If `isCreatingRoster` is false, stop polling
        if (!selectedRender.value?.isCreatingRoster) {
          // Fetch assets data
          await rendersStore.fetchAssetsByRenderAction(
            routeParams.accountId.value, // Ensure the values are numbers if needed
            routeParams.renderId.value,
            routeParams.groupingCategory.value,
            routeParams.assetType.value
          );

          isPolling.value = false;
          return true;
        }

        attempts++;
        await delay(pollInterval);
      }

      if (!pollingEnabled.value) {
        throw new Error("Polling stopped due to component unmounting.");
      }

      throw new Error("Max polling attempts reached");
    } catch (err) {
      error.value = handleError(err);
      return false;
    } finally {
      isPolling.value = false;
      clearTimeout(pollTimeout);
    }
  };

  // Function to resume polling if needed
  const resumeCreationPollingIfNeeded = async () => {
    if (selectedRender.value?.isCreatingRoster) {
      await pollForCreationCompletion();
    }
  };

  // Helper function to create a delay
  const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => {
      pollTimeout = setTimeout(resolve, ms);
    });
  };

  // Stop polling when necessary
  const stopPolling = () => {
    if (pollTimeout) {
      clearTimeout(pollTimeout);
      pollTimeout = 0;
    }
    pollingEnabled.value = false;
    isPolling.value = false;
  };

  // Helper function to handle errors
  const handleError = (err: unknown): string => {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error(errorMessage);
    return errorMessage;
  };

  // Watch `selectedRender` to keep `isPolling` in sync
  watchEffect(() => {
    isPolling.value = Boolean(selectedRender.value?.isCreatingRoster);
  });

  return {
    loading,
    error,
    success,
    isPolling,
    createRoster,
    stopPolling,
    resumeCreationPollingIfNeeded,
  };
}

/**
 * Extracts and returns route parameters
 * @returns Object containing route parameters as reactive references
 */
function useRouteParams(): RouteParams {
  const route = useRoute();
  return {
    accountId: ref(Number(route.params.accountid)),
    renderId: ref(Number(route.params.renderid)),
    groupingCategory: ref(
      decodeURIComponent(String(route.params.groupingcategory))
    ),
    sport: ref(String(route.params.sport)),
    assetType: ref(String(route.params.asset)),
  };
}
