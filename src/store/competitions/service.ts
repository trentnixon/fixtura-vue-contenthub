import fetcher from "@/actions/fetcher";
import { Competition } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchCompetitionFromService(
  id: number
): Promise<ApiResponse<Competition>> {
  const response = await fetcher.get<ApiResponse<Competition>>(
    `/competitions/${id}?populate=*`
  );
  return response;
}

export async function fetchCompetitionsFromService(): Promise<
  ApiResponse<Competition[]>
> {
  const response = await fetcher.get<ApiResponse<Competition[]>>(
    `/competitions?populate=*`
  );
  return response;
}
