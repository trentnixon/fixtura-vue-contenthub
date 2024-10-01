// store/getters.ts

import { computed } from "vue";
import { usePrivateAccountState } from "./private";

// Existing getters
export const accounts = computed(() => usePrivateAccountState().accounts);
export const useAccountDetails = computed(
  () => usePrivateAccountState().accountDetails
);
export const selectedAccount = computed(
  () => usePrivateAccountState().selectedAccount
);
export const loading = computed(() => usePrivateAccountState().loading);
export const error = computed(() => usePrivateAccountState().error);

// New getters
export const accountDetails = computed(
  () => usePrivateAccountState().accountDetails
);

export const rollupMetrics = computed(() => {
  return usePrivateAccountState().accountDetails?.rollup || null;
});
export const metricsOverTime = computed(() => {
  return usePrivateAccountState().accountDetails?.metricsOverTime || null;
});
export const metricsAsPercentageOfCost = computed(() => {
  return (
    usePrivateAccountState().accountDetails?.metricsAsPercentageOfCost || null
  );
});

// Existing computed properties
export const getAccountType = computed(() => {
  return useAccountDetails.value?.account_type ?? 0;
});

export const getAccountName = computed(() => {
  return useAccountDetails.value?.FirstName ?? "";
});

export const getAccountRenderToken = computed(() => {
  return useAccountDetails.value?.render_token.token ?? null;
});

export const getOrganizationDetails = computed(() => {
  return useAccountDetails.value?.accountOrganisationDetails ?? null;
});

export const getAccountTemplate = computed(() => {
  return useAccountDetails.value?.template ?? null;
});

export const getAccountTheme = computed(() => {
  return useAccountDetails.value?.theme ?? null;
});

export const getAccountRenders = computed(() => {
  return useAccountDetails.value?.renders ?? null;
});

export const getAccountSport = computed(() => {
  return useAccountDetails.value?.Sport ?? null;
});

export const isSchedulerQueued = computed(() => {
  return useAccountDetails.value?.scheduler.Queued ?? null;
});

export const isSchedulerRendering = computed(() => {
  return useAccountDetails.value?.scheduler.isRendering ?? null;
});
