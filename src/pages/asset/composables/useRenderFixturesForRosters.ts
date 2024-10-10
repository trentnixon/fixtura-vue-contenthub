// composables/useRosterFixtures.ts
import { computed, ref, onMounted, Ref } from "vue";
import { useRendersStore } from "@/store/renders";
import { useRoute } from "vue-router";

interface RouteParams {
  accountId: Ref<number>;
  renderId: Ref<number>;
  groupingCategory: Ref<string>;
  sport: Ref<string>;
}

export function useRosterFixtures() {
  const routeParams = useRouteParams();
  const rendersStore = useRendersStore();
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getter to get the roster poster fixtures from the store
  const rosterFixtures = computed(() => rendersStore.getRosterPosterFixtures);

  // Function to fetch the roster fixtures
  const fetchFixtures = async () => {
    try {
      loading.value = true;
      error.value = null;
      console.log("[fetchFixtures]");
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

  return {
    rosterFixtures,
    loading,
    error,
    fetchFixtures,
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
    groupingCategory: ref(String(route.params.groupingcategory)),
    sport: ref(String(route.params.sport)),
  };
}
