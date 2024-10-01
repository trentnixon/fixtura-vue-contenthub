import { defineStore } from "pinia";
import { GroupingDetails, Render } from "@/types"; // Use the new Render type

export interface PrivateRendersState {
  selectedGrouping: GroupingDetails | null;
  selectedRender: Render | null;
  loading: boolean;
  error: string | null;
}

export const usePrivateRendersState = defineStore("renders-private", {
  state: (): PrivateRendersState => ({
    selectedGrouping: null,
    selectedRender: null,
    loading: false,
    error: null,
  }),
});
