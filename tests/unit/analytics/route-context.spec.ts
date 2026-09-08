import { parseHubRoute, resolveHubFunnelEvent } from "@/lib/analytics";

describe("parseHubRoute", () => {
  it("parses account landing route", () => {
    const context = parseHubRoute({
      params: { accountid: "42" },
      query: {},
      path: "/42",
      name: "account",
    } as never);

    expect(context).toEqual({
      account_id: 42,
      is_edit_route: false,
    });
  });

  it("parses full asset route", () => {
    const context = parseHubRoute({
      params: {
        accountid: "42",
        sport: "cricket",
        renderid: "99",
        groupingcategory: "Seniors",
        asset: "CricketResults",
      },
      query: {},
      path: "/42/cricket/99/Seniors/CricketResults",
      name: undefined,
    } as never);

    expect(context).toEqual({
      account_id: 42,
      sport: "cricket",
      render_id: 99,
      grouping_category: "Seniors",
      asset_type: "CricketResults",
      is_edit_route: false,
    });
  });

  it("parses edit route context from query params", () => {
    const context = parseHubRoute({
      params: { accountid: "42" },
      query: {
        asset: "cricketresults",
        renderid: "99",
        sport: "cricket",
        groupingcategory: "Seniors",
      },
      path: "/42/edit/processEdit",
      name: "processEdit",
    } as never);

    expect(context).toEqual({
      account_id: 42,
      render_id: 99,
      sport: "cricket",
      grouping_category: "Seniors",
      asset_type: "cricketresults",
      is_edit_route: true,
    });
  });
});

describe("resolveHubFunnelEvent", () => {
  it("maps account landing to hub_opened", () => {
    expect(
      resolveHubFunnelEvent({ account_id: 42, is_edit_route: false })
    ).toBe("hub_opened");
  });

  it("maps pack route to pack_viewed", () => {
    expect(
      resolveHubFunnelEvent({
        account_id: 42,
        render_id: 99,
        is_edit_route: false,
      })
    ).toBe("pack_viewed");
  });

  it("maps category route to category_viewed", () => {
    expect(
      resolveHubFunnelEvent({
        account_id: 42,
        render_id: 99,
        grouping_category: "Seniors",
        is_edit_route: false,
      })
    ).toBe("category_viewed");
  });

  it("maps asset route to asset_viewed", () => {
    expect(
      resolveHubFunnelEvent({
        account_id: 42,
        render_id: 99,
        grouping_category: "Seniors",
        asset_type: "CricketResults",
        is_edit_route: false,
      })
    ).toBe("asset_viewed");
  });

  it("maps edit route to asset_edit_opened", () => {
    expect(
      resolveHubFunnelEvent({
        account_id: 42,
        render_id: 99,
        asset_type: "cricketresults",
        is_edit_route: true,
      })
    ).toBe("asset_edit_opened");
  });

  it("returns null when no account context", () => {
    expect(resolveHubFunnelEvent({ is_edit_route: false })).toBeNull();
  });
});
