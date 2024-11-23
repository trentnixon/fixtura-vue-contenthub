import fetcher from "@/actions/fetcher";
import { Account, RelatedClub, RelatedClubsResponse } from "@/types/account";

/* export async function fetchAccountsFromService() {
  return fetcher.get<{ data: Account[] }>("/accounts?populate=*");
} */

export async function fetchAccountDetailsFromService(id: number) {
  return fetcher.get<{ data: Account }>(`/accounts/${id}?populate=*`);
}

export async function fetchFilteredAccountDetailsFromService(id: number) {
  return fetcher.get<{ data: Account }>(
    `/account/fixturaContentHubAccountDetails/${id}`
  );
}

export async function fetchAccountMediaLibrary(id: number) {
  return fetcher.get<{ data: Account }>(`/account-media-libraries`, {
    params: {
      filters: {
        account: {
          id: {
            $eq: id,
          },
        },
      },
      populate: {
        imageId: {
          fields: ["url", "width", "height"],
        },
      },
    },
  });
}

export async function fetchRelatedClubsService(
  associationId: number
): Promise<RelatedClubsResponse> {
  const response = await fetcher.get<{ data: RelatedClubsResponse }>(
    `/associations/${associationId}`,
    {
      params: {
        populate: {
          clubs: {
            populate: {
              Logo: {
                fields: ["url", "width", "height"],
              },
            },
          },
        },
      },
    }
  );

  return response.data; // Return the actual data inside `data`
}
