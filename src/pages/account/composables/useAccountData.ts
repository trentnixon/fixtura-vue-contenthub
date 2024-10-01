// composables/useAccountData.ts

import { useAccountStore } from "@/store/account";
import { storeToRefs } from "pinia";
export function useAccountData() {
  const accountStore = useAccountStore();

  const {
    loading,
    error,
    getAccountType,
    rollupMetrics,
    metricsOverTime,
    metricsAsPercentageOfCost,
    getAccountName,
    getAccountRenderToken,
    getOrganizationDetails,
    getAccountTemplate,
    getAccountTheme,
    getAccountRenders,
    getAccountSport,
    isSchedulerQueued,
    isSchedulerRendering,
  } = storeToRefs(accountStore);

  /**
   * Fetch the account by ID and store the details in Pinia
   * @param id - Account ID
   */
  async function fetchAccountById(id: number) {
    try {
      await accountStore.fetchFilteredAccountDetails(id);
    } catch (err) {
      console.error("Failed to fetch account:", err);
    }
  }

  return {
    // State and Actions
    /*  accountDetails, */
    fetchAccountById,
    loading,
    error,
    getAccountType,
    rollupMetrics,
    getAccountName,
    getAccountRenderToken,
    getOrganizationDetails,
    getAccountTemplate,
    getAccountTheme,
    getAccountSport,
    getAccountRenders,
    metricsOverTime,
    metricsAsPercentageOfCost,
    isSchedulerQueued,
    isSchedulerRendering,
  };
}
