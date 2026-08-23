import { createPinia, setActivePinia } from "pinia";
import { trackAssetEditSaved, trackPackRerun } from "@/lib/analytics";
import { saveFixturaAsset, triggerRerender } from "@/store/downloads/actions";
import {
  triggerRerenderInService,
  updateDownloadInService,
} from "@/store/downloads/service";

jest.mock("@/lib/analytics", () => ({
  trackPackRerun: jest.fn(),
  trackAssetEditSaved: jest.fn(),
}));

jest.mock("@/store/downloads/service", () => ({
  triggerRerenderInService: jest.fn(),
  fetchRerenderStatusFromService: jest.fn(),
  fetchDownloadFromService: jest.fn(),
  fetchDownloadsByRenderIdFromService: jest.fn(),
  updateDownloadInService: jest.fn(),
  fetchAssetByLinkIDFromService: jest.fn(),
}));

const mockTriggerRerenderInService =
  triggerRerenderInService as jest.MockedFunction<
    typeof triggerRerenderInService
  >;
const mockUpdateDownloadInService =
  updateDownloadInService as jest.MockedFunction<
    typeof updateDownloadInService
  >;

describe("downloads store Asset pack_rerun gating", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    jest.clearAllMocks();
  });

  it("emits pack_rerun with trigger asset when rerender succeeds", async () => {
    mockTriggerRerenderInService.mockResolvedValue({ data: true });

    await triggerRerender(42, { render_id: 7, account_id: 3 });

    expect(trackPackRerun).toHaveBeenCalledWith({
      asset_id: 42,
      render_id: 7,
      account_id: 3,
      trigger: "asset",
    });
  });

  it("does not emit pack_rerun when rerender data is unsuccessful", async () => {
    mockTriggerRerenderInService.mockResolvedValue({ data: false });

    await triggerRerender(42, { render_id: 7, account_id: 3 });

    expect(trackPackRerun).not.toHaveBeenCalled();
  });

  it("does not emit pack_rerun when rerender request fails", async () => {
    mockTriggerRerenderInService.mockRejectedValue(new Error("network"));

    await triggerRerender(42);

    expect(trackPackRerun).not.toHaveBeenCalled();
  });
});

describe("downloads store asset_edit_saved gating", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    jest.clearAllMocks();
  });

  it("emits asset_edit_saved when CMS save succeeds", async () => {
    mockUpdateDownloadInService.mockResolvedValue({ data: { id: 9 } });

    const ok = await saveFixturaAsset(
      9,
      { title: "x" },
      {
        account_id: 3,
        render_id: 7,
        asset_type: "RosterPoster",
      }
    );

    expect(ok).toBe(true);
    expect(trackAssetEditSaved).toHaveBeenCalledWith({
      download_id: 9,
      account_id: 3,
      render_id: 7,
      asset_type: "RosterPoster",
    });
  });

  it("does not emit asset_edit_saved when CMS save returns empty", async () => {
    mockUpdateDownloadInService.mockResolvedValue(null);

    const ok = await saveFixturaAsset(
      9,
      { title: "x" },
      {
        account_id: 3,
        render_id: 7,
      }
    );

    expect(ok).toBe(false);
    expect(trackAssetEditSaved).not.toHaveBeenCalled();
  });

  it("does not emit asset_edit_saved when CMS save throws", async () => {
    mockUpdateDownloadInService.mockRejectedValue(new Error("cms down"));

    const ok = await saveFixturaAsset(9, { title: "x" }, { account_id: 3 });

    expect(ok).toBe(false);
    expect(trackAssetEditSaved).not.toHaveBeenCalled();
  });
});
