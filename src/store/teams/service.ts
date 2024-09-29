import fetcher from "@/actions/fetcher";
import { Team } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchTeamFromService(
  id: number
): Promise<ApiResponse<Team>> {
  const response = await fetcher.get<ApiResponse<Team>>(
    `/teams/${id}?populate=*`
  );
  return response;
}

export async function fetchTeamsByClubIdFromService(
  clubId: number
): Promise<ApiResponse<Team[]>> {
  const response = await fetcher.get<ApiResponse<Team[]>>(
    `/teams?filters[club][id][$eq]=${clubId}&populate=*`
  );
  return response;
}
