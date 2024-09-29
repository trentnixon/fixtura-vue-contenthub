import fetcher from "@/actions/fetcher";
import { GameDataAFL } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchGameDataAFLFromService(
  id: number
): Promise<ApiResponse<GameDataAFL>> {
  const response = await fetcher.get<ApiResponse<GameDataAFL>>(
    `/game_data_afls/${id}?populate=*`
  );
  return response;
}

export async function fetchGameDataAFLsFromService(): Promise<
  ApiResponse<GameDataAFL[]>
> {
  const response = await fetcher.get<ApiResponse<GameDataAFL[]>>(
    `/game_data_afls?populate=*`
  );
  return response;
}
