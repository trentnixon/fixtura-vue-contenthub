import fetcher from "@/actions/fetcher";
import { Order } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchOrdersFromService(): Promise<ApiResponse<Order[]>> {
  const response = await fetcher.get<ApiResponse<Order[]>>(
    "/orders?populate=*"
  );
  return response;
}

export async function fetchOrderDetailsFromService(
  id: number
): Promise<ApiResponse<Order>> {
  const response = await fetcher.get<ApiResponse<Order>>(
    `/orders/${id}?populate=*`
  );
  return response;
}

export async function fetchOrdersByAccountIdFromService(
  accountId: number
): Promise<ApiResponse<Order[]>> {
  const response = await fetcher.get<ApiResponse<Order[]>>(
    `/orders?filters[account][id][$eq]=${accountId}&populate=*`
  );
  return response;
}
