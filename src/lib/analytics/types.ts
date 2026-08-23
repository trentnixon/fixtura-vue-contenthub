export type AnalyticsSurface = "marketing_site" | "app" | "hub";

export const HUB_SURFACE: AnalyticsSurface = "hub";

export type AssetDownloadContext = {
  asset_id: number;
  render_id: number;
  account_id: number;
  asset_type: string;
};

export type MeResponse = {
  id?: number;
  data?: {
    id?: number;
  };
};
