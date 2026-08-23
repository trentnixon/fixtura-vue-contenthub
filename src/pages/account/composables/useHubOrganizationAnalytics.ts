import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useAccountStore } from "@/store/account";
import { onAccountLoaded } from "@/lib/analytics";

/**
 * Sets PostHog Organization group whenever Account Organisation details
 * are available — including deep-links that never mount AccountView.
 */
export function useHubOrganizationAnalytics() {
  const route = useRoute();
  const accountStore = useAccountStore();
  const { getOrganizationDetails, loading } = storeToRefs(accountStore);

  watch(
    [loading, getOrganizationDetails, () => route.params.accountid],
    () => {
      if (loading.value || !getOrganizationDetails.value) {
        return;
      }

      const accountId = Number(route.params.accountid);
      if (!accountId) {
        return;
      }

      onAccountLoaded(accountId, getOrganizationDetails.value);
    },
    { immediate: true }
  );
}
