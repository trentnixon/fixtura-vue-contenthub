import fetcher from "@/actions/fetcher";
import { Grade } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchGradeFromService(
  id: number
): Promise<ApiResponse<Grade>> {
  const response = await fetcher.get<ApiResponse<Grade>>(
    `/grades/${id}?populate=*`
  );
  return response;
}

export async function fetchGradesFromService(): Promise<ApiResponse<Grade[]>> {
  const response = await fetcher.get<ApiResponse<Grade[]>>(
    `/grades?populate=*`
  );
  return response;
}
