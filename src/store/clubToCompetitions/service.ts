import fetcher from "@/actions/fetcher";
import { ClubToCompetition } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchClubToCompetitionFromService(
  id: number
): Promise<ApiResponse<ClubToCompetition>> {
  const response = await fetcher.get<ApiResponse<ClubToCompetition>>(
    `/club-to-competitions/${id}?populate=*`
  );
  return response;
}

export async function fetchClubToCompetitionsByClubIdFromService(
  clubId: number
): Promise<ApiResponse<ClubToCompetition[]>> {
  const response = await fetcher.get<ApiResponse<ClubToCompetition[]>>(
    `/club-to-competitions?filters[club][id][$eq]=${clubId}&populate=*`
  );
  return response;
}
