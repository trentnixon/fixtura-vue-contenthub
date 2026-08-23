import type { RouteLocationNormalized } from "vue-router";

export type HubRouteContext = {
  account_id?: number;
  render_id?: number;
  sport?: string;
  grouping_category?: string;
  asset_type?: string;
  is_edit_route: boolean;
};

export type HubFunnelEvent =
  | "hub_opened"
  | "pack_viewed"
  | "category_viewed"
  | "asset_viewed"
  | "asset_edit_opened"
  | null;

type RouteParamValue = string | string[] | null | undefined;

function firstString(...values: RouteParamValue[]): string | undefined {
  for (const value of values) {
    if (Array.isArray(value)) {
      const first = value.find((entry) => typeof entry === "string" && entry);
      if (first) {
        return first;
      }
      continue;
    }
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

function firstNumber(...values: RouteParamValue[]): number | undefined {
  const raw = firstString(...values);
  if (!raw) {
    return undefined;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed !== 0 ? parsed : undefined;
}

export function parseHubRoute(route: RouteLocationNormalized): HubRouteContext {
  const accountId = firstNumber(
    route.params.accountid as RouteParamValue,
    route.query.accountid as RouteParamValue
  );
  const renderId = firstNumber(
    route.params.renderid as RouteParamValue,
    route.query.renderid as RouteParamValue
  );
  const sport = firstString(
    route.params.sport as RouteParamValue,
    route.query.sport as RouteParamValue
  );
  const groupingCategoryRaw = firstString(
    route.params.groupingcategory as RouteParamValue,
    route.query.groupingcategory as RouteParamValue
  );
  const groupingCategory = groupingCategoryRaw
    ? decodeURIComponent(groupingCategoryRaw)
    : undefined;
  const assetType = firstString(
    route.params.asset as RouteParamValue,
    route.query.asset as RouteParamValue
  );

  return {
    ...(accountId ? { account_id: accountId } : {}),
    ...(renderId ? { render_id: renderId } : {}),
    ...(sport ? { sport } : {}),
    ...(groupingCategory ? { grouping_category: groupingCategory } : {}),
    ...(assetType ? { asset_type: assetType } : {}),
    is_edit_route:
      route.name === "processEdit" || route.path.includes("/edit/"),
  };
}

export function resolveHubFunnelEvent(
  context: HubRouteContext
): HubFunnelEvent {
  if (context.is_edit_route) {
    return "asset_edit_opened";
  }
  if (context.asset_type && context.render_id && context.account_id) {
    return "asset_viewed";
  }
  if (context.grouping_category && context.render_id && context.account_id) {
    return "category_viewed";
  }
  if (context.render_id && context.account_id) {
    return "pack_viewed";
  }
  if (context.account_id) {
    return "hub_opened";
  }
  return null;
}

export function hubRouteContextProperties(
  context: HubRouteContext
): Record<string, string | number> {
  const properties: Record<string, string | number> = {};

  if (context.account_id) {
    properties.account_id = context.account_id;
  }
  if (context.render_id) {
    properties.render_id = context.render_id;
  }
  if (context.sport) {
    properties.sport = context.sport;
  }
  if (context.grouping_category) {
    properties.grouping_category = context.grouping_category;
  }
  if (context.asset_type) {
    properties.asset_type = context.asset_type;
  }

  return properties;
}
