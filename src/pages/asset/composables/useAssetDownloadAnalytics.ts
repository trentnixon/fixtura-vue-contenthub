import { useRoute } from "vue-router";
import type { AssetDownloadContext } from "@/lib/analytics";

type AssetLike = {
  id?: number;
  category?: string;
  assetCategory?: string;
};

export function useAssetDownloadAnalytics() {
  const route = useRoute();

  function buildDownloadContext(
    asset: AssetLike,
    assetType: string
  ): AssetDownloadContext | null {
    const accountId = Number(route.params.accountid);
    const renderId = Number(route.params.renderid);
    const assetId = asset.id;

    if (!accountId || !renderId || !assetId) {
      return null;
    }

    return {
      account_id: accountId,
      render_id: renderId,
      asset_id: assetId,
      asset_type: asset.category || asset.assetCategory || assetType,
    };
  }

  return {
    buildDownloadContext,
  };
}
