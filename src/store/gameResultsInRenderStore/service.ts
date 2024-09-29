import fetcher from "@/actions/fetcher";
import { GameResultsInRender } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchGameResultsInRenderByRenderIdFromService(
  renderId: number
): Promise<ApiResponse<GameResultsInRender[]>> {
  const response = await fetcher.get<ApiResponse<GameResultsInRender[]>>(
    `/game-results-in-renders?filters[render][id][$eq]=${renderId}&populate=*`
  );
  return response;
}
