import { computed } from "vue";
import { useAccountStore } from "@/store/account";
import { useSchedulerStore } from "@/store/scheduler";
import { useOrdersStore } from "@/store/orders";
import { useAssociationStore } from "@/store/associationStore";
import { useClubStore } from "@/store/clubStore";
import { storeToRefs } from "pinia";

export function useAccountData() {
  const accountStore = useAccountStore();
  const {
    selectedAccount,
    loading,
    error,
    getAccountType,
    getAccountRenderToken,
    getAccountTemplate,
    getAccountTheme,
    getAccountTrialInstance,
    getAccountSubscription,
  } = storeToRefs(accountStore);

  const schedulerStore = useSchedulerStore();
  const { scheduler } = storeToRefs(schedulerStore);

  const ordersStore = useOrdersStore();
  const { accountOrders } = storeToRefs(ordersStore);

  const associationStore = useAssociationStore();
  const { getAssociation } = storeToRefs(associationStore); // Update here

  const clubStore = useClubStore();
  const { getClub } = storeToRefs(clubStore); // Update here

  // Fetch the account by ID
  async function fetchAccountById(id: number) {
    try {
      await accountStore.fetchAccountDetails(id);
    } catch (err) {
      console.error("Failed to fetch account:", err);
    }
  }

  // Get the account name
  const getAccountName = computed(() => {
    const firstName = selectedAccount.value?.FirstName || "";
    const lastName = selectedAccount.value?.LastName || "";
    return `${firstName} ${lastName}`.trim() || "Unknown";
  });

  // Get the account's associated clubs or associations based on the account type
  const getOrganizationDetails = computed(() => {
    const accountType = getAccountType.value;

    if (accountType === "Association") {
      return {
        type: "Association",
        details: getAssociation.value, // Filter out any null/undefined values
      };
    } else if (accountType === "Club") {
      return {
        type: "Club",
        details: getClub.value,
      };
    } else {
      return null;
    }
  });

  // Get the account's sport
  const getAccountSport = computed(() => {
    return selectedAccount.value?.Sport || "Unknown";
  });

  // Get the account's scheduler details
  const getScheduler = computed(() => {
    return selectedAccount.value?.scheduler?.data?.attributes || null;
  });
  const getSchedulerID = computed(() => {
    return selectedAccount.value?.scheduler?.data?.id || null;
  });
  const getTemplateDetails = computed(() => {
    return selectedAccount.value?.template?.data?.attributes || null;
  });

  const getTrialInstance = computed(() => {
    return selectedAccount.value?.trial_instance?.data?.attributes || null;
  });

  // Get the account's sponsors
  const getSponsors = computed(() => {
    return selectedAccount.value?.sponsors?.data || [];
  });

  // Get the account's trial status
  const getTrialStatus = computed(() => {
    const trial = getAccountTrialInstance.value;
    return trial ? trial.isActive : false;
  });

  // Get the account's render expiration date
  const getRenderExpiration = computed(() => {
    return getAccountRenderToken.value?.expiration || "No expiration date";
  });

  // Get the scheduler's queued status
  const isSchedulerQueued = computed(() => {
    return getScheduler.value?.Queued || false;
  });

  // Get the scheduler's rendering status
  const isSchedulerRendering = computed(() => {
    return getScheduler.value?.isRendering || false;
  });

  return {
    selectedAccount,
    fetchAccountById,
    getAccountName,
    getAccountType,
    getOrganizationDetails,
    getAccountSport,
    getAccountRenderToken,
    getRenderExpiration,
    getTrialInstance,
    getTemplateDetails,
    getAccountTemplate,
    getAccountTheme,
    getAccountTrialInstance,
    getTrialStatus,
    getAccountSubscription,
    getScheduler,
    getSchedulerID,
    isSchedulerQueued,
    isSchedulerRendering,
    getSponsors,
    loading,
    error,
  };
}
