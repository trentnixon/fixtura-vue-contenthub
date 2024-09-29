import { usePrivateCustomerState } from "./private";
import {
  fetchCustomersFromService,
  fetchCustomerDetailsFromService,
  fetchAccountCustomersFromService,
} from "./service";
import { Customer } from "@/types";

export async function fetchCustomers() {
  const state = usePrivateCustomerState();
  try {
    state.loading = true;
    const response = await fetchCustomersFromService();
    if (response && response.data) {
      state.customers = response.data as Customer[];
      //console.log("Fetched customers data:", state.customers);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchCustomerDetails(id: number) {
  const state = usePrivateCustomerState();
  try {
    state.loading = true;
    const response = await fetchCustomerDetailsFromService(id);
    if (response && response.data) {
      state.customerDetails = response.data as Customer;
      //console.log("Fetched customer details:", state.customerDetails);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchAccountCustomers(accountId: number) {
  const state = usePrivateCustomerState();
  try {
    state.loading = true;
    const response = await fetchAccountCustomersFromService(accountId);
    if (response && response.data) {
      state.accountCustomers = response.data as Customer[];
      //console.log("Fetched account customers data:", state.accountCustomers);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
