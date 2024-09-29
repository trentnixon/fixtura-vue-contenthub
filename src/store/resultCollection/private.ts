import { defineStore } from "pinia";
import { ResultCollection } from "@/types";

export interface PrivateResultCollectionState {
  resultCollections: ResultCollection[];
  accountResultCollections: ResultCollection[];
  resultCollectionDetails: ResultCollection | null;
  loading: boolean;
  error: string | null;
}

export const usePrivateResultCollectionState = defineStore(
  "resultCollection-private",
  {
    state: (): PrivateResultCollectionState => ({
      resultCollections: [],
      accountResultCollections: [],
      resultCollectionDetails: null,
      loading: false,
      error: null,
    }),
  }
);
