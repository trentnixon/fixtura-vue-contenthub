import { computed } from "vue";
import { usePrivateCustomerState } from "./private";

export const customers = computed(() => usePrivateCustomerState().customers);
export const accountCustomers = computed(
  () => usePrivateCustomerState().accountCustomers
);
export const customerDetails = computed(
  () => usePrivateCustomerState().customerDetails
);
export const loading = computed(() => usePrivateCustomerState().loading);
export const error = computed(() => usePrivateCustomerState().error);

export const customerCount = computed(() => customers.value.length);
export const accountCustomerCount = computed(
  () => accountCustomers.value.length
);
