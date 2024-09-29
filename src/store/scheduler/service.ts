import fetcher from "@/actions/fetcher";
import { Scheduler } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchSchedulerFromService(
  id: number
): Promise<ApiResponse<Scheduler>> {
  const response = await fetcher.get<ApiResponse<Scheduler>>(
    `/schedulers/${id}?populate=*`
  );
  return response;
}
