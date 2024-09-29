import fetcher from "@/actions/fetcher";
import { AccountMediaLibrary } from "@/types/accountMediaLibrary";

export async function fetchAccountMediaLibraries(
  accountId: number
): Promise<AccountMediaLibrary[]> {
  try {
    const response = await fetcher.get<{ data: AccountMediaLibrary[] }>(
      `/account-media-libraries?filters[account][id][$eq]=${accountId}&populate=*`
    );
    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
