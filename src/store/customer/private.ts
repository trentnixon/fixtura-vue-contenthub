import { defineStore } from "pinia";
import { Customer } from "@/types";

export interface PrivateCustomerState {
  customers: Customer[];
  accountCustomers: Customer[];
  customerDetails: Customer | null;
  loading: boolean;
  error: string | null;
}

export const usePrivateCustomerState = defineStore("customer-private", {
  state: (): PrivateCustomerState => ({
    customers: [],
    accountCustomers: [],
    customerDetails: null,
    loading: false,
    error: null,
  }),
});
