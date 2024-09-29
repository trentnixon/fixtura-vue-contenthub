import fetcher from "@/actions/fetcher";
import { Account } from "@/types/account";

/* export async function fetchAccountsFromService() {
  return fetcher.get<{ data: Account[] }>("/accounts?populate=*");
} */

export async function fetchAccountDetailsFromService(id: number) {
  return fetcher.get<{ data: Account }>(`/accounts/${id}?populate=*`);
}
