import { defineStore } from "pinia";
import { Order } from "@/types";

export interface PrivateOrdersState {
  orders: Order[]; // All orders fetched
  accountOrders: Order[]; // Orders specific to an account
  activeOrders: Order[]; // Active orders across all accounts
  expiredOrders: Order[]; // Expired orders across all accounts
  singleOrder: Order | null; // Single order details
  selectedAccountOrders: Order[]; // Orders for a selected account
  loading: boolean;
  error: string | null;
}

export const usePrivateOrdersState = defineStore("orders-private", {
  state: (): PrivateOrdersState => ({
    orders: [],
    accountOrders: [],
    activeOrders: [],
    expiredOrders: [],
    singleOrder: null,
    selectedAccountOrders: [],
    loading: false,
    error: null,
  }),
});
