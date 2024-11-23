import {
  fetchAccountMediaLibrary,
  fetchFilteredAccountDetailsFromService,
  fetchRelatedClubsService,
} from "./service";
import { usePrivateAccountState } from "./private";
import { AccountResponse, RelatedClubsResponse } from "@/types";

export async function fetchFilteredAccountDetails(id: number) {
  const state = usePrivateAccountState();
  try {
    state.loading = true;
    const response = await fetchFilteredAccountDetailsFromService(id);
    if (response && response.data) {
      state.accountDetails = (response as AccountResponse).data;
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

// New action for fetching account media library
export async function fetchAccountMediaLibraryAction(id: number) {
  const state = usePrivateAccountState();
  try {
    state.loading = true;
    const response = await fetchAccountMediaLibrary(id);
    if (response && response.data) {
      // Assuming `accountMediaLibrary` is a property in your state
      state.accountMediaLibrary = response.data;
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchRelatedClubsAction(associationId: number) {
  const state = usePrivateAccountState();
  try {
    state.loading = true;

    // Fetch the API response
    const response = await fetchRelatedClubsService(associationId);

    // Map the response to the desired `relatedClubs` structure
    if (response.attributes.clubs.data) {
      state.relatedClubs = response.attributes.clubs.data.map((club) => ({
        id: club.id,
        name: club.attributes.Name,
        logo: {
          url: club.attributes.Logo?.data?.attributes?.url || DefaultLogo.url,
          width:
            club.attributes.Logo?.data?.attributes?.width || DefaultLogo.width,
          height:
            club.attributes.Logo?.data?.attributes?.height ||
            DefaultLogo.height,
        },
      }));
    } else {
      state.relatedClubs = []; // Default to an empty array if no clubs are found
    }
  } catch (error) {
    state.error = (error as Error).message;
    console.error("Error fetching related clubs:", error);
  } finally {
    state.loading = false;
  }
}

const DefaultLogo = {
  url: "https://fixtura.s3.ap-southeast-2.amazonaws.com/Default_ICON_171b58a21b.png",
  width: 800,
  height: 800,
};
