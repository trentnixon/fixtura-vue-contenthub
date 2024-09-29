import { usePrivateOrdersState } from "./private";
import {
  fetchOrdersFromService,
  fetchOrderDetailsFromService,
  fetchOrdersByAccountIdFromService,
} from "./service";
import { Order } from "@/types";

/*
fetchOrders: Fetch all orders.
fetchSingleOrder: Fetch details of a single order by order ID.
fetchAccountOrders: Fetch all orders associated with a specific account by account ID.
setOrders: Fetch and set multiple orders by their IDs.
fetchActiveOrders: Fetch all active orders.
fetchExpiredOrders: Fetch all expired orders.
*/

export async function fetchOrders() {
  const state = usePrivateOrdersState();
  try {
    state.loading = true;
    const response = await fetchOrdersFromService();
    if (response && response.data) {
      state.orders = response.data as Order[];
      //console.log("Fetched orders data:", state.orders);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchSingleOrder(orderId: number) {
  const state = usePrivateOrdersState();
  try {
    state.loading = true;
    const response = await fetchOrderDetailsFromService(orderId);
    if (response && response.data) {
      state.singleOrder = response.data as Order; // Store the single order
      //console.log("Fetched single order data:", state.singleOrder);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchAccountOrders(accountId: number) {
  const state = usePrivateOrdersState();
  try {
    state.loading = true;
    const response = await fetchOrdersByAccountIdFromService(accountId);
    if (response && response.data) {
      state.accountOrders = response.data as Order[];
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function setOrders(orderIds: number[]) {
  const state = usePrivateOrdersState();
  state.accountOrders = []; // Reset account orders before fetching new ones
  state.loading = true;
  state.error = null;
  try {
    for (const id of orderIds) {
      await fetchAccountOrders(id);
    }
    //console.log("Fetched all order details:", state.accountOrders);
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchActiveOrders() {
  const state = usePrivateOrdersState();
  try {
    state.loading = true;
    const response = await fetchOrdersFromService();
    if (response && response.data) {
      state.activeOrders = response.data.filter(
        (order) => order.attributes.isActive
      ) as Order[];
      //console.log("Fetched active orders data:", state.activeOrders);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchExpiredOrders() {
  const state = usePrivateOrdersState();
  try {
    state.loading = true;
    const response = await fetchOrdersFromService();
    if (response && response.data) {
      state.expiredOrders = response.data.filter(
        (order) => !order.attributes.isActive
      ) as Order[];
      //console.log("Fetched expired orders data:", state.expiredOrders);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchOrdersForSelectedAccount(accountId: number) {
  const state = usePrivateOrdersState();
  try {
    state.loading = true;
    const response = await fetchOrdersByAccountIdFromService(accountId);
    if (response && response.data) {
      state.selectedAccountOrders = response.data as Order[];
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
