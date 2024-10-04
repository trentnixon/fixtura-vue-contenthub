import { defineStore } from "pinia";
import { GroupingDetails, Render, RenderAssetsResponse } from "@/types"; // Use the new Render type

export interface PrivateRendersState {
  selectedGrouping: GroupingDetails | null;
  selectedRender: Render | null;
  loading: boolean;
  error: string | null;
  selectedFixturaAsset: RenderAssetsResponse | null; // Add assets state
}

export const usePrivateRendersState = defineStore("renders-private", {
  state: (): PrivateRendersState => ({
    selectedGrouping: null,
    selectedRender: null,
    loading: false,
    error: null,
    selectedFixturaAsset: null,
  }),
});
