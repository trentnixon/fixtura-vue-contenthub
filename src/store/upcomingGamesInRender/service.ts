import fetcher from "@/actions/fetcher";
import { UpcomingGameInRender } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchUpcomingGamesByRenderIdFromService(
  renderId: number
): Promise<ApiResponse<UpcomingGameInRender[]>> {
  const response = await fetcher.get<ApiResponse<UpcomingGameInRender[]>>(
    `/upcoming-games-in-renders?filters[render][id][$eq]=${renderId}&populate=*`
  );
  return response;
}
