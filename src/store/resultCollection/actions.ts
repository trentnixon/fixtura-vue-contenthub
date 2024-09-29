import { usePrivateResultCollectionState } from "./private";
import {
  fetchResultCollectionsFromService,
  fetchResultCollectionDetailsFromService,
  fetchAccountResultCollectionsFromService,
} from "./service";

export async function fetchResultCollections() {
  const state = usePrivateResultCollectionState();
  try {
    state.loading = true;
    const response = await fetchResultCollectionsFromService();
    if (response && response.data) {
      state.resultCollections = response.data;
      //console.log("Fetched result collections data:", state.resultCollections);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchResultCollectionDetails(id: number) {
  const state = usePrivateResultCollectionState();
  try {
    state.loading = true;
    const response = await fetchResultCollectionDetailsFromService(id);
    if (response && response.data) {
      state.resultCollectionDetails = response.data;

    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchAccountResultCollections(accountId: number) {
  const state = usePrivateResultCollectionState();
  try {
    state.loading = true;
    const response = await fetchAccountResultCollectionsFromService(accountId);
    if (response && response.data) {
      state.accountResultCollections = response.data;

    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
