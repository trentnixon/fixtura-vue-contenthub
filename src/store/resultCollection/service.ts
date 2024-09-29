import fetcher from "@/actions/fetcher";
import { ResultCollection } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchResultCollectionsFromService(): Promise<
  ApiResponse<ResultCollection[]>
> {
  const response = await fetcher.get<ApiResponse<ResultCollection[]>>(
    "/result-collections?populate=*"
  );
  return response;
}

export async function fetchResultCollectionDetailsFromService(
  id: number
): Promise<ApiResponse<ResultCollection>> {
  const response = await fetcher.get<ApiResponse<ResultCollection>>(
    `/result-collections/${id}?populate=*`
  );
  return response;
}

export async function fetchAccountResultCollectionsFromService(
  accountId: number
): Promise<ApiResponse<ResultCollection[]>> {
  const response = await fetcher.get<ApiResponse<ResultCollection[]>>(
    `/result-collections?filters[account][id][$eq]=${accountId}&populate=*`
  );
  return response;
}
