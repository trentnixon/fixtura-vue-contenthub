import fetcher from "@/actions/fetcher";
import { Render } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchRenderFromService(
  id: number
): Promise<ApiResponse<Render>> {
  const response = await fetcher.get<ApiResponse<Render>>(`/renders/${id}`);
  return response;
}
