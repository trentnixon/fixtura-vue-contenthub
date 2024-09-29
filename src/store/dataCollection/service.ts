import fetcher from "@/actions/fetcher";
import { DataCollection } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchDataCollectionsFromService(): Promise<
  ApiResponse<DataCollection[]>
> {
  const response = await fetcher.get<ApiResponse<DataCollection[]>>(
    "/data-collections?populate=*"
  );
  return response;
}

export async function fetchDataCollectionDetailsFromService(
  id: number
): Promise<ApiResponse<DataCollection>> {
  const response = await fetcher.get<ApiResponse<DataCollection>>(
    `/data-collections/${id}?populate=*`
  );
  return response;
}

export async function fetchAccountDataCollectionsFromService(
  accountId: number
): Promise<ApiResponse<DataCollection[]>> {
  const response = await fetcher.get<ApiResponse<DataCollection[]>>(
    `/data-collections?filters[account][id][$eq]=${accountId}&populate=*`
  );
  return response;
}
