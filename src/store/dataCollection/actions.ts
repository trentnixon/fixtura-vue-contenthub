import { usePrivateDataCollectionState } from "./private";
import {
  fetchDataCollectionsFromService,
  fetchDataCollectionDetailsFromService,
  fetchAccountDataCollectionsFromService,
} from "./service";
import { DataCollection } from "@/types";

export async function fetchDataCollections() {
  const state = usePrivateDataCollectionState();
  try {
    state.loading = true;
    const response = await fetchDataCollectionsFromService();
    if (response && response.data) {
      state.dataCollections = response.data as DataCollection[];
      //console.log("Fetched data collections data:", state.dataCollections);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchDataCollectionDetails(id: number) {
  const state = usePrivateDataCollectionState();
  try {
    state.loading = true;
    const response = await fetchDataCollectionDetailsFromService(id);
    if (response && response.data) {
      state.dataCollectionDetails = response.data as DataCollection;
      //console.log("Fetched data collection details:", state.dataCollectionDetails);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchAccountDataCollections(accountId: number) {
  const state = usePrivateDataCollectionState();
  try {
    state.loading = true;
    const response = await fetchAccountDataCollectionsFromService(accountId);
    if (response && response.data) {
      state.accountDataCollections = response.data as DataCollection[];
      //console.log("Fetched account data collections data:", state.accountDataCollections);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

// New action for fetching parent-level data collections
export async function fetchParentDataCollections() {
  const state = usePrivateDataCollectionState();
  try {
    state.loading = true;
    const response = await fetchDataCollectionsFromService();
    if (response && response.data) {
      state.parentDataCollections = response.data as DataCollection[];
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
