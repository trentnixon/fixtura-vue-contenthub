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

const populateFields = [
  "Name",
  "asset.Name",
  "asset_type.Name",
  "asset_category.Name",
  "account.Name",
  "scheduler.Name",
  "render.Name",
  "hasCompleted",
  "forceRerender",
  "hasError",
  "structuredOutput",
  // Add or remove fields easily here
];
// Function to construct the populate query string
function constructPopulateQuery(fields: string[]): string {
  return fields.map((field, index) => `populate[${index}]=${field}`).join("&");
}

export async function fetchAiArticlesByRenderIdFromService(
  renderId: number
): Promise<ApiResponse<AiArticle[]>> {
  const baseUrl = `/ai-articles?filters[render][id][$eq]=${renderId}`;
  const populateQuery = constructPopulateQuery(populateFields);
  const fullUrl = `${baseUrl}&${populateQuery}`;

  const response = await fetcher.get<ApiResponse<AiArticle[]>>(fullUrl);
  return response;
}
