import fetcher from "@/actions/fetcher";
import { GameDataNetball } from "@/types";

interface ApiResponse<T> {
  data: T;
}

export async function fetchGameDataNetballFromService(
  id: number
): Promise<ApiResponse<GameDataNetball>> {
  const response = await fetcher.get<ApiResponse<GameDataNetball>>(
    `/game_data_netballs/${id}?populate=*`
  );
  return response;
}

export async function fetchGameDataNetballsFromService(): Promise<
  ApiResponse<GameDataNetball[]>
> {
  const response = await fetcher.get<ApiResponse<GameDataNetball[]>>(
    `/game_data_netballs?populate=*`
  );
  return response;
}
