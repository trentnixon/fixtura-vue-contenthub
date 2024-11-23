// private.ts
import { defineStore } from "pinia";
import { Account } from "@/types/account";
import { RelatedClub } from "@/types/account";

export interface PrivateAccountState {
  accounts: Account[];
  accountDetails: Account | null;
  selectedAccount: Account | null;
  accountMediaLibrary: Account | null;
  relatedClubs: RelatedClub[];
  loading: boolean;
  error: string | null;
}

export const usePrivateAccountState = defineStore("account-private", {
  state: (): PrivateAccountState => ({
    accounts: [],
    accountDetails: null,
    selectedAccount: null,
    accountMediaLibrary: null,
    relatedClubs: [],
    loading: false,
    error: null,
  }),
});
