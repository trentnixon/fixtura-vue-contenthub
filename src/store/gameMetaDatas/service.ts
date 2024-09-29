import fetcher from "@/actions/fetcher";
import { GameMetaData } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchGameMetaDataFromService(
  id: number
): Promise<ApiResponse<GameMetaData>> {
  const response = await fetcher.get<ApiResponse<GameMetaData>>(
    `/game-meta-datas/${id}?populate=*`
  );
  return response;
}

export async function fetchGameMetaDatasByTeamIdFromService(
  teamId: number
): Promise<ApiResponse<GameMetaData[]>> {
  const response = await fetcher.get<ApiResponse<GameMetaData[]>>(
    `/game-meta-datas?filters[teams][id][$eq]=${teamId}&populate=*`
  );
  return response;
}
