import type { RouteLocationNormalized } from "vue-router";
import {
  hubRouteContextProperties,
  parseHubRoute,
  resolveHubFunnelEvent,
  type HubRouteContext,
} from "./route-context";
import {
  captureHubEvent,
  capturePageview,
  getPostHogClient,
  trackHubOpened,
  trackPackViewed,
} from "./posthog";

const ROUTE_REGISTER_KEYS = [
  "account_id",
  "render_id",
  "sport",
  "grouping_category",
  "asset_type",
] as const;

function registerRouteContext(context: HubRouteContext): void {
  const client = getPostHogClient();
  if (!client) {
    return;
  }

  const properties = hubRouteContextProperties(context);
  for (const key of ROUTE_REGISTER_KEYS) {
    if (properties[key] === undefined) {
      client.unregister(key);
    }
  }
  client.register(properties);
}

function emitFunnelEvent(context: HubRouteContext): void {
  const event = resolveHubFunnelEvent(context);

  switch (event) {
    case "asset_edit_opened":
      captureHubEvent("asset_edit_opened", hubRouteContextProperties(context));
      return;
    case "asset_viewed":
      captureHubEvent("asset_viewed", hubRouteContextProperties(context));
      return;
    case "category_viewed":
      captureHubEvent("category_viewed", hubRouteContextProperties(context));
      return;
    case "pack_viewed":
      if (context.render_id && context.account_id) {
        trackPackViewed(context.render_id, context.account_id);
      }
      return;
    case "hub_opened":
      if (context.account_id) {
        trackHubOpened(context.account_id, context.sport);
      }
      return;
    default:
      return;
  }
}

export function trackHubRouteChange(to: RouteLocationNormalized): void {
  if (!to.params.accountid) {
    capturePageview(to.fullPath);
    return;
  }

  const context = parseHubRoute(to);
  registerRouteContext(context);
  capturePageview(to.fullPath, context);
  emitFunnelEvent(context);
}
