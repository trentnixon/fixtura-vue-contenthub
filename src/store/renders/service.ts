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
    const response = await fetcher.get<ApiResponse<GroupingDetails>>(
      `/render/fixturaContentHubGroupingDetails/${userID}/${renderID}/${groupingCategory}`
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
    const response = await fetcher.get<ApiResponse<RenderAssetsResponse>>(
      `/render/fixturaGetAssetsFromRender/${userID}/${renderID}/${groupingCategory}/${assetType}`
    );

    return response;
  } catch (error) {
    console.error(
      `Error fetching assets for user ${userID}, render ${renderID}, grouping ${groupingCategory}, assetType ${assetType}:`,
      error
    );
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
    const response = await fetcher.get<ApiResponse<RenderFixture[]>>(
      `/render/fixturaGetFixturesFromRenderForRosters/${userID}/${renderID}/${groupingCategory}/${sport}`
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
