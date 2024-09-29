import fetcher from "@/actions/fetcher";
import { Customer } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchCustomersFromService(): Promise<
  ApiResponse<Customer[]>
> {
  const response = await fetcher.get<ApiResponse<Customer[]>>(
    "/customers?populate=*"
  );
  return response;
}

export async function fetchCustomerDetailsFromService(
  id: number
): Promise<ApiResponse<Customer>> {
  const response = await fetcher.get<ApiResponse<Customer>>(
    `/customers/${id}?populate=*`
  );
  return response;
}

export async function fetchAccountCustomersFromService(
  accountId: number
): Promise<ApiResponse<Customer[]>> {
  const response = await fetcher.get<ApiResponse<Customer[]>>(
    `/customers?filters[account][id][$eq]=${accountId}&populate=*`
  );
  return response;
}
