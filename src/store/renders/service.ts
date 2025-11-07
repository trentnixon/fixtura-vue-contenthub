import fetcher from "@/actions/fetcher";
import {
  GroupingDetails,
  Render,
  RenderAssetsResponse,
  RenderFixture,
} from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchRenderFromService(
  id: number
): Promise<ApiResponse<Render>> {
  try {
    const response = await fetcher.get<ApiResponse<Render>>(`/renders/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching render with ID ${id}:`, error);
    throw new Error(`Failed to fetch render data.`);
  }
}

export async function fetchFixturaRenderDetails(
  userID: number,
  renderID: number
): Promise<ApiResponse<Render>> {
  try {
    const response = await fetcher.get<ApiResponse<Render>>(
      `/render/fixturaContentHubRenderDetails/${userID}/${renderID}`
    );
    return response;
  } catch (error) {
    console.error(
      `Error fetching Fixtura render details for user ${userID} and render ${renderID}:`,
      error
    );
    throw new Error(`Failed to fetch Fixtura render details.`);
  }
}

export async function fetchGroupingDetailsFromService(
  userID: number,
  renderID: number,
  groupingCategory: string
): Promise<ApiResponse<GroupingDetails>> {
  try {
    // Encode the grouping category to handle special characters and forward slashes
    const encodedCategory = encodeURIComponent(groupingCategory);
    const response = await fetcher.get<ApiResponse<GroupingDetails>>(
      `/render/fixturaContentHubGroupingDetails/${userID}/${renderID}/${encodedCategory}`
    );
    return response;
  } catch (error) {
    console.error(
      `Error fetching grouping details for user ${userID}, render ${renderID}, and grouping ${groupingCategory}:`,
      error
    );
    throw new Error(`Failed to fetch grouping details.`);
  }
}

export async function fetchAssetsByRender(
  userID: number,
  renderID: number,
  groupingCategory: string,
  assetType: string
): Promise<ApiResponse<RenderAssetsResponse>> {
  try {
    // Encode the grouping category to handle special characters and forward slashes
    const encodedCategory = encodeURIComponent(groupingCategory);
    const url = `/render/fixturaGetAssetsFromRender/${userID}/${renderID}/${encodedCategory}/${assetType}`;

    console.log("[fetchAssetsByRender] API URL:", url);
    console.log("[fetchAssetsByRender] Request params:", {
      userID,
      renderID,
      groupingCategory,
      encodedCategory,
      assetType,
    });

    const response = await fetcher.get<ApiResponse<RenderAssetsResponse>>(url);

    console.log("[fetchAssetsByRender] Raw API response:", response);
    console.log("[fetchAssetsByRender] Response data:", response?.data);

    return response;
  } catch (error) {
    console.error(
      `[fetchAssetsByRender] Error fetching assets for user ${userID}, render ${renderID}, grouping ${groupingCategory}, assetType ${assetType}:`,
      error
    );

    // Log more details about the error
    if (error instanceof Error) {
      console.error("[fetchAssetsByRender] Error message:", error.message);
      console.error("[fetchAssetsByRender] Error stack:", error.stack);
    }

    // Check if it's an axios error with response data
    if ((error as any)?.response) {
      console.error("[fetchAssetsByRender] API Error Response:", {
        status: (error as any).response.status,
        statusText: (error as any).response.statusText,
        data: (error as any).response.data,
      });
    }

    throw new Error("Failed to fetch assets.");
  }
}

export async function fetchFixturesByRenderForRoster(
  userID: number,
  renderID: number,
  groupingCategory: string,
  sport: string
): Promise<ApiResponse<RenderFixture[]>> {
  try {
    // Encode the grouping category to handle special characters and forward slashes
    const encodedCategory = encodeURIComponent(groupingCategory);
    const response = await fetcher.get<ApiResponse<RenderFixture[]>>(
      `/render/fixturaGetFixturesFromRenderForRosters/${userID}/${renderID}/${encodedCategory}/${sport}`
    );
    return response;
  } catch (error) {
    console.error(
      `Error fetching fixtures for user ${userID}, render ${renderID}, grouping ${groupingCategory}, sport ${sport}:`,
      error
    );
    throw new Error("Failed to fetch fixtures.");
  }
}

// ROSTERS
export async function requestTeamRoster(
  renderID: number
): Promise<ApiResponse<{ status: string; renderId: number }>> {
  try {
    const response = await fetcher.post<
      ApiResponse<{ status: string; renderId: number }>
    >(`/render/RequestTeamRoster`, { ID: renderID });
    return response;
  } catch (error) {
    console.error(
      `Error requesting team roster for render ID ${renderID}:`,
      error
    );
    throw new Error("Failed to request team roster.");
  }
}

interface SaveRosterResponse {
  success: boolean; // Example property, update it according to your actual response structure
  message?: string; // Optional message property
}

export async function saveRosterToCMS(
  gameId: number,
  updatedRoster: object
): Promise<ApiResponse<SaveRosterResponse>> {
  try {
    const response = await fetcher.put<ApiResponse<SaveRosterResponse>>(
      `/game-meta-datas/${gameId}`,
      {
        data: {
          TeamRoster: updatedRoster,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(`Failed to save roster for game ID ${gameId}:`, error);
    throw new Error("Failed to save roster.");
  }
}

export async function createRosterService(
  renderId: number,
  groupingId: string
): Promise<ApiResponse<{ status: string; renderId: number }>> {
  try {
    // Encode the grouping ID to handle special characters and forward slashes
    const encodedGroupingId = encodeURIComponent(groupingId);
    const response = await fetcher.get<
      ApiResponse<{ status: string; renderId: number }>
    >(`/render/fixturaCreateTeamRosters/${renderId}/${encodedGroupingId}`);
    return response;
  } catch (error) {
    console.error(
      `Error creating team roster for render ID ${renderId} and grouping ID ${groupingId}:`,
      error
    );
    throw new Error("Failed to create team roster.");
  }
}
