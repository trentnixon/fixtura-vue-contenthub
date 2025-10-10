// composables/useRosterFixtures.ts
import { computed, ref, Ref, watchEffect } from "vue";
import { useRendersStore } from "@/store/renders";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

interface RouteParams {
  accountId: Ref<number>;
  renderId: Ref<number>;
  groupingCategory: Ref<string>;
  sport: Ref<string>;
}

export function useRosterFixtures() {
  const routeParams = useRouteParams();
  const rendersStore = useRendersStore();
  const { selectedRender } = storeToRefs(rendersStore);

  const loading = ref(false);
  const error = ref<string | null>(null);
  const isRosterSaving = ref(false);
  const isPolling = ref(false);

  const pollInterval = 5000; // Poll every 2 seconds
  let pollTimeout: ReturnType<typeof setTimeout>;

  // Getter to get the roster poster fixtures from the store
  const rosterFixtures = computed(() => rendersStore.getRosterPosterFixtures);

  // Watch `selectedRender` to keep `isPolling` in sync
  watchEffect(() => {
    isPolling.value = Boolean(selectedRender.value?.hasTeamRosterRequest);
  });

  // Function to fetch the roster fixtures
  const fetchFixtures = async () => {
    try {
      loading.value = true;
      error.value = null;
      // Use extracted route params to fetch fixtures
      await rendersStore.fetchFixturesByRenderForRosterPosters(
        routeParams.accountId.value,
        routeParams.renderId.value,
        routeParams.groupingCategory.value,
        routeParams.sport.value
      );
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  // Function to request the team roster based on the render ID
  const requestTeamRoster = async () => {
    try {
      loading.value = true;
      error.value = null;
      await rendersStore.requestTeamRosterAction(routeParams.renderId.value);
      await rendersStore.fetchFixturaRenderById(
        routeParams.accountId.value,
        routeParams.renderId.value,
        false
      );

      // add a wait 1 sec before starting polling
      //await delay(1000);

      // Start polling to check if sync is complete
      await pollForSyncCompletion(
        routeParams.accountId.value,
        routeParams.renderId.value
      );
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  // Polling function to check if sync is complete
  const pollForSyncCompletion = async (
    accountId: number,
    renderId: number,
    maxAttempts = 50
  ) => {
    let attempts = 0;
    isPolling.value = true;

    try {
      while (attempts < maxAttempts) {
        await rendersStore.fetchFixturaRenderById(accountId, renderId, false);
        if (!selectedRender.value?.hasTeamRosterRequest) {
          isPolling.value = false;
          // Fetch the fixtures once sync is complete
          await fetchFixtures();
          return true;
        }

        attempts++;
        await delay(pollInterval);
      }

      throw new Error("Max polling attempts reached");
    } catch (err) {
      handleError(err, "Error while polling for sync completion");
      return false;
    } finally {
      isPolling.value = false;
      clearTimeout(pollTimeout);
    }
  };

  // Function to resume polling if needed
  const resumePollingIfNeeded = async () => {
    if (selectedRender.value?.hasTeamRosterRequest) {
      await pollForSyncCompletion(
        routeParams.accountId.value,
        routeParams.renderId.value
      );
    }
  };

  // Function to save updated roster changes
  const saveRosterChanges = async (gameId: number, updatedRoster: object) => {
    isRosterSaving.value = true;
    try {
      await rendersStore.saveRosterChanges(gameId, updatedRoster);
      isRosterSaving.value = false;
    } catch (error) {
      console.error("Failed to save roster changes:", error);
      isRosterSaving.value = false;
    }
  };

  /**
   * Creates a delay using a Promise and setTimeout
   */
  const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => {
      pollTimeout = setTimeout(resolve, ms);
    });
  };

  /**
   * Handles errors by setting the error message and logging to console
   */
  const handleError = (error: unknown, prefix = "") => {
    const errorMessage = `${prefix}: ${(error as Error).message}`;
    console.error(errorMessage);
  };

  const stopPolling = () => {
    if (pollTimeout) {
      clearTimeout(pollTimeout);
      pollTimeout = 0;
    }
    isPolling.value = false;
  };

  return {
    rosterFixtures,
    loading,
    isPolling,
    error,
    isRosterSaving,
    fetchFixtures,
    requestTeamRoster,
    saveRosterChanges,
    resumePollingIfNeeded,
    stopPolling,
  };
}

/**
 * Extracts and returns route parameters
 * @returns Object containing route parameters as reactive references
 */
function useRouteParams(): RouteParams {
  const route = useRoute();
  return {
    accountId: computed(() => Number(route.params.accountid)),
    renderId: computed(() => Number(route.params.renderid)),
    groupingCategory: computed(() => {
      // Ensure the grouping category is properly decoded
      const rawCategory = String(route.params.groupingcategory);
      return decodeURIComponent(rawCategory);
    }),
    sport: computed(() => String(route.params.sport)),
  };
}
