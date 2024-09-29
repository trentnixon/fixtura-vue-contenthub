// store/accountMediaLibrary/private.ts
import { defineStore } from "pinia";
import { AccountMediaLibrary } from "@/types/accountMediaLibrary";

export interface PrivateAccountMediaLibraryState {
  accountMediaLibraries: AccountMediaLibrary[];
  loading: boolean;
  error: string | null;
}

export const usePrivateAccountMediaLibraryState = defineStore(
  "accountMediaLibrary-private",
  {
    state: (): PrivateAccountMediaLibraryState => ({
      accountMediaLibraries: [],
      loading: false,
      error: null,
    }),
  }
);
