import { usePrivateAssociationState } from "./private";
import fetcher from "@/actions/fetcher";
import { Association } from "@/types";

export async function fetchAssociation(id: number) {
  const state = usePrivateAssociationState();
  state.loading = true;
  state.error = null;
  try {
    const response = await fetcher.get<{ data: Association }>(
      `/associations/${id}?populate=*`
    );
    if (response && response.data) {
      state.association = response.data;
      //console.log("Fetched association details:", state.association);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export function setAssociation(association: { id: number }) {
  fetchAssociation(association.id);
}
