import { Render } from "@/types";
import { usePrivateRendersState } from "./private";
import {
  createRosterService,
  fetchAssetsByRender,
  fetchFixturaRenderDetails,
  fetchFixturesByRenderForRoster,
  fetchGroupingDetailsFromService,
  fetchRenderFromService,
  requestTeamRoster,
  saveRosterToCMS,
} from "./service";

export async function fetchRenderAction(renderId: number) {
  try {
    const response = await fetchRenderFromService(renderId);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch render:", error);
    throw error;
  }
}

export async function fetchFixturaRenderById(
  userID: number,
  renderID: number,
  loading = true
) {
  const state = usePrivateRendersState();
  try {
    state.loading = loading;
    const response = await fetchFixturaRenderDetails(userID, renderID);

    if (response && response.data) {
      // Validate that the response matches the expected structure
      const render: Render = response.data;
      state.selectedRender = render; // Set the selected render in the state
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

// Action to fetch grouping details by grouping category
export async function fetchGroupingDetails(
  userID: number,
  renderID: number,
  groupingCategory: string
) {
  const state = usePrivateRendersState();

  try {
    state.loading = true;
    state.error = null; // Reset error before fetching

    const response = await fetchGroupingDetailsFromService(
      userID,
      renderID,
      groupingCategory
    );

    if (response && response.data) {
      // Set the selected grouping details in the state
      state.selectedGrouping = response.data;
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.selectedGrouping = null; // Clear selected grouping on error
    state.error = `Failed to fetch grouping details: ${
      (error as Error).message
    }`;
  } finally {
    state.loading = false;
  }
}

export async function fetchAssetsByRenderAction(
  userID: number,
  renderID: number,
  groupingCategory: string,
  assetType: string
) {
  const state = usePrivateRendersState();

  try {
    state.loading = true;
    state.error = null;

    const response = await fetchAssetsByRender(
      userID,
      renderID,
      groupingCategory,
      assetType
    );

    if (response && response.data) {
      state.selectedFixturaAsset = response.data; // Set the assets in the state
    } else {
      throw new Error("Invalid assets data structure");
    }
  } catch (error) {
    state.error = `Failed to fetch assets: ${(error as Error).message}`;
  } finally {
    state.loading = false;
  }
}

export async function fetchFixturesByRenderForRosterPosters(
  userID: number,
  renderID: number,
  groupingCategory: string,
  sport: string
) {
  const state = usePrivateRendersState();

  try {
    // change these loading states to be more specific
    //state.loading = true;
    //state.error = null;

    const response = await fetchFixturesByRenderForRoster(
      userID,
      renderID,
      groupingCategory,
      sport
    );

    if (response && response.data) {
      state.selectedFixturesForRosters = response.data; // Set the fixtures in the state
    } else {
      throw new Error("Invalid fixtures data structure");
    }
  } catch (error) {
    state.error = `Failed to fetch fixtures: ${(error as Error).message}`;
  } finally {
    //state.loading = false;
  }
}

export async function requestTeamRosterAction(renderID: number) {
  const state = usePrivateRendersState();

  try {
    state.loading = true;
    //state.error = null;

    const response = await requestTeamRoster(renderID);
    console.log("[response]", response);
    if (response && response.data && response.data.status) {
      //state.requestStatus = "success";
      //state.selectedRenderId = response.data.renderId;
    } else {
      //throw new Error(response?.data?.message || "An unknown error occurred");
    }
  } catch (error) {
    //state.error = (error as Error).message;
    //state.requestStatus = "fail";
  } finally {
    state.loading = false;
  }
}

export async function saveRosterChanges(gameId: number, updatedRoster: object) {
  try {
    const response = await saveRosterToCMS(gameId, updatedRoster);
  } catch (error) {
    console.error("Error in saveRosterChanges action:", error);
  }
}

export async function createTeamRosterAction(
  renderId: number,
  groupingId: string
) {
  const state = usePrivateRendersState();

  try {
    //state.loading = true;
    state.error = null;
    const response = await createRosterService(renderId, groupingId);
    if (response) {
      console.log("Roster creation job added successfully:", response);
    } else {
      throw new Error("Failed to add roster creation job");
    }
  } catch (error) {
    state.error = `Failed to create team roster: ${(error as Error).message}`;
  } finally {
    //state.loading = false;
  }
}
