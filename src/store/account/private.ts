import { defineStore } from "pinia";
import { Account } from "@/types/account";

export interface PrivateAccountState {
  accounts: Account[];
  accountDetails: Account | null;
  selectedAccount: Account | null;
  loading: boolean;
  error: string | null;
}

export const usePrivateAccountState = defineStore("account-private", {
  state: (): PrivateAccountState => ({
    accounts: [],
    accountDetails: null,
    selectedAccount: null,
    loading: false,
    error: null,
  }),
});
