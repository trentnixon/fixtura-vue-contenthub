import fetcher from "@/actions/fetcher";
import { AiArticle } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchAiArticleFromService(
  id: number
): Promise<ApiResponse<AiArticle>> {
  const response = await fetcher.get<ApiResponse<AiArticle>>(
    `/ai-articles/${id}?populate=*`
  );
  return response;
}

export async function fetchAiArticlesByRenderIdFromService(
  renderId: number
): Promise<ApiResponse<AiArticle[]>> {
  const response = await fetcher.get<ApiResponse<AiArticle[]>>(
    `/ai-articles?filters[render][id][$eq]=${renderId}&populate=*`
  );
  return response;
}
