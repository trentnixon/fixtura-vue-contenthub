// store/accountMediaLibrary/actions.ts
import { usePrivateAccountMediaLibraryState } from "./private";
import fetcher from "@/actions/fetcher";
import { AccountMediaLibrary } from "@/types/accountMediaLibrary";

export async function fetchAccountMediaLibraries(accountId: number) {
  const state = usePrivateAccountMediaLibraryState();
  state.loading = true;
  state.error = null;

  try {
    const response = await fetcher.get<{ data: AccountMediaLibrary[] }>(
      `/account-media-libraries?filters[account][id][$eq]=${accountId}&populate=*`
    );
    if (response && response.data) {
      state.accountMediaLibraries = response.data;
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}
