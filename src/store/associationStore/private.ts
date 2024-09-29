import { defineStore } from "pinia";
import { Association } from "@/types";

export interface PrivateAssociationState {
  association: Association | null;
  loading: boolean;
  error: string | null;
}

export const usePrivateAssociationState = defineStore("association-private", {
  state: (): PrivateAssociationState => ({
    association: null,
    loading: false,
    error: null,
  }),
});
