import fetcher from "@/actions/fetcher";
import { Download } from "@/types";
import { AssetData } from "@/types/fetchAssetByLink";

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

export async function triggerRerenderInService(
  id: number
): Promise<ApiResponse<boolean>> {
  const response = await fetcher.post<ApiResponse<boolean>>(
    `/download/ForceAssetRerender`,
    {
      data: { RerenderID: id },
    }
  );
  return response;
}

export async function fetchRerenderStatusFromService(
  id: number
): Promise<ApiResponse<{ hasBeenProcessed: boolean; hasError: boolean }>> {
  const response = await fetcher.get<
    ApiResponse<{ hasBeenProcessed: boolean; hasError: boolean }>
  >(`/download/rerender/status/${id}`);
  return response;
}

export async function fetchAssetByLinkIDFromService(assetLinkID: string) {
  const response = await fetcher.get<AssetData>(
    `/download/asset-by-link/${assetLinkID}`
  );
  return response;
}

export async function updateDownloadInService(id: number, data: any) {
  const response = await fetcher.put(`/downloads/${id}`, data);
  return response;
}
