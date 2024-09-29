import { computed } from "vue";
import { usePrivateOrdersState } from "./private";
export const orders = computed(() => usePrivateOrdersState().orders);
export const accountOrders = computed(
  () => usePrivateOrdersState().accountOrders
);
export const selectedAccountOrders = computed(
  () => usePrivateOrdersState().selectedAccountOrders
);
export const loading = computed(() => usePrivateOrdersState().loading);
export const error = computed(() => usePrivateOrdersState().error);

export const orderCount = computed(() => orders.value.length);
export const accountOrderCount = computed(() => accountOrders.value.length);
export const activeOrders = computed(() =>
  orders.value.filter((order) => order.attributes.isActive)
);
export const activeOrderCount = computed(() => activeOrders.value.length);

export const getOrderById = (id: number) => {
  return orders.value.find((order) => order.id === id) || null;
};
