import { Render, RenderAttributes } from "@/types";
import { usePrivateRendersState } from "./private";
import {
  fetchFixturaRenderDetails,
  fetchGroupingDetailsFromService,
} from "./service";

export async function fetchFixturaRenderById(userID: number, renderID: number) {
  const state = usePrivateRendersState();
  try {
    state.loading = true;
    const response = await fetchFixturaRenderDetails(userID, renderID);

    if (response && response.data) {
      console.log("[response]", response.data);

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
