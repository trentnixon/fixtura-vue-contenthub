import posthog from "posthog-js";
import { hasAnalyticsConsent } from "./consent";
import type { HubRouteContext } from "./route-context";
import { hubRouteContextProperties } from "./route-context";
import type { AssetDownloadContext } from "./types";
import { HUB_SURFACE } from "./types";

let initialized = false;

export function isAnalyticsEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === "true" &&
    Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY)
  );
}

function canCapture(): boolean {
  if (!isAnalyticsEnabled() || !initialized || !hasAnalyticsConsent()) {
    return false;
  }

  // Cookie may flip after init with opt_out_capturing_by_default — align SDK.
  posthog.opt_in_capturing();
  return true;
}

export function initAnalytics(): void {
  if (!isAnalyticsEnabled() || initialized || typeof window === "undefined") {
    return;
  }

  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest";

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: apiHost,
    autocapture: false,
    capture_pageview: false,
    persistence: "localStorage+cookie",
    opt_out_capturing_by_default: !hasAnalyticsConsent(),
  });

  initialized = true;
}

export function capturePageview(
  path: string,
  context?: HubRouteContext
): void {
  if (!canCapture()) {
    return;
  }

  posthog.capture("$pageview", {
    surface: HUB_SURFACE,
    $current_url: path,
    ...(context ? hubRouteContextProperties(context) : {}),
  });
}

export function captureHubEvent(
  event: string,
  properties: Record<string, unknown> = {}
): void {
  if (!canCapture()) {
    return;
  }

  posthog.capture(event, {
    surface: HUB_SURFACE,
    ...properties,
  });
}

const HUB_OPENED_SESSION_KEY = "fixtura_hub_opened_session";

export function trackHubOpened(accountId: number, sport?: string): void {
  if (!canCapture()) {
    return;
  }

  if (sessionStorage.getItem(HUB_OPENED_SESSION_KEY)) {
    return;
  }

  sessionStorage.setItem(HUB_OPENED_SESSION_KEY, "1");
  captureHubEvent("hub_opened", {
    account_id: accountId,
    ...(sport ? { sport } : {}),
  });
}

export function trackPackViewed(renderId: number, accountId: number): void {
  captureHubEvent("pack_viewed", {
    render_id: renderId,
    account_id: accountId,
  });
}

export function trackAssetDownloaded(context: AssetDownloadContext): void {
  captureHubEvent("asset_downloaded", context);
}

export function trackPackRerun(properties: {
  render_id?: number;
  asset_id?: number;
  account_id?: number;
  trigger: "asset" | "pack_request";
  reason?: string;
}): void {
  captureHubEvent("pack_rerun", properties);
}

export function trackAssetEditSaved(properties: {
  asset_id?: number;
  asset_type?: string;
  account_id?: number;
  render_id?: number;
  download_id?: number;
}): void {
  captureHubEvent("asset_edit_saved", properties);
}

export function trackRosterSyncRequested(properties: {
  account_id?: number;
  render_id?: number;
  grouping_category?: string;
}): void {
  captureHubEvent("roster_sync_requested", properties);
}

export function trackRosterCreateRequested(properties: {
  account_id?: number;
  render_id?: number;
  grouping_category?: string;
}): void {
  captureHubEvent("roster_create_requested", properties);
}

export function setOrganizationGroup(orgId: number, orgName?: string): void {
  if (!canCapture()) {
    return;
  }

  posthog.group(
    "organization",
    String(orgId),
    orgName ? { name: orgName } : {}
  );
}

export function onAccountLoaded(
  _accountId: number,
  org: { id: number; Name: string } | null
): void {
  if (org) {
    setOrganizationGroup(org.id, org.Name);
  }
}

export function getPostHogClient(): typeof posthog | null {
  return initialized ? posthog : null;
}
