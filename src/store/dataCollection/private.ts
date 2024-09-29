import { defineStore } from "pinia";
import { DataCollection } from "@/types";

export interface PrivateDataCollectionState {
  dataCollections: DataCollection[];
  accountDataCollections: DataCollection[];
  dataCollectionDetails: DataCollection | null;
  parentDataCollections: DataCollection[];
  loading: boolean;
  error: string | null;
}

export const usePrivateDataCollectionState = defineStore(
  "dataCollection-private",
  {
    state: (): PrivateDataCollectionState => ({
      dataCollections: [],
      accountDataCollections: [],
      dataCollectionDetails: null,
      parentDataCollections: [],
      loading: false,
      error: null,
    }),
  }
);
