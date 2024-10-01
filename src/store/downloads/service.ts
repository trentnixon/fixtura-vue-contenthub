import fetcher from "@/actions/fetcher";
import { Download } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchDownloadFromService(
  id: number
): Promise<ApiResponse<Download>> {
  const response = await fetcher.get<ApiResponse<Download>>(
    `/downloads/${id}?populate[asset_category][fields]=Name,Identifier&populate[asset_type][fields]=Name&populate[asset][fields]=Name,CompositionID`
  );
  return response;
}

export async function fetchDownloadsByRenderIdFromService(
  renderId: number
): Promise<ApiResponse<Download[]>> {
  const response = await fetcher.get<ApiResponse<Download[]>>(
    `/downloads?filters[render][id][$eq]=${renderId}&populate[asset_category][fields]=Name,Identifier&populate[asset_type][fields]=Name&populate[asset][fields]=Name,CompositionID`
  );
  return response;
}