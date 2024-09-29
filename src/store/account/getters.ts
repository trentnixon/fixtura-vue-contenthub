import { computed } from "vue";
import { usePrivateAccountState } from "./private";

// keep for now
export const accounts = computed(() => usePrivateAccountState().accounts);

//
export const selectedAccount = computed(
  () => usePrivateAccountState().selectedAccount
);
export const loading = computed(() => usePrivateAccountState().loading);
export const error = computed(() => usePrivateAccountState().error);


export const accountDetails = computed(
  () => usePrivateAccountState().accountDetails
);
export const getAccountType = computed(() => {
  return selectedAccount.value
    ? selectedAccount.value.account_type?.data.attributes.Name
    : null;
});

export const getAccountRenderToken = computed(() => {
  return selectedAccount.value
    ? selectedAccount.value.render_token?.data.attributes
    : null;
});

export const getAccountTemplate = computed(() => {
  return selectedAccount.value
    ? selectedAccount.value.template?.data.attributes
    : null;
});

export const getAccountTheme = computed(() => {
  return selectedAccount.value
    ? selectedAccount.value.theme?.data.attributes
    : null;
});

export const getAccountTrialInstance = computed(() => {
  return selectedAccount.value
    ? selectedAccount.value.trial_instance?.data.attributes
    : null;
});

export const getAccountSubscription = computed(() => {
  return selectedAccount.value
    ? selectedAccount.value.subscription_tier?.data
    : null;
});
