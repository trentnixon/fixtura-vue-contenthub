import fetcher from "@/actions/fetcher";
import { GradeInRender } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchGradesByRenderIdFromService(
  renderId: number
): Promise<ApiResponse<GradeInRender[]>> {
  const response = await fetcher.get<ApiResponse<GradeInRender[]>>(
    `/grades-in-renders?filters[render][id][$eq]=${renderId}&populate=*`
  );
  return response;
}
