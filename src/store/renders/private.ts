import { defineStore } from "pinia";
import { Render } from "@/types";

export interface PrivateRendersState {
  selectedRender: Render | null;
  loading: boolean;
  error: string | null;
}

export const usePrivateRendersState = defineStore("renders-private", {
  state: (): PrivateRendersState => ({
    selectedRender: null,
    loading: false,
    error: null,
  }),
});
