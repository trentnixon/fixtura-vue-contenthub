import posthog from "posthog-js";
import { fetchCurrentUserId } from "./auth";
import { hasAnalyticsConsent } from "./consent";
import type { AssetDownloadContext } from "./types";
import { HUB_SURFACE } from "./types";

let initialized = false;

export function isAnalyticsEnabled(): boolean {
  return (
    process.env.VUE_APP_FEATURE_ANALYTICS === "true" &&
    Boolean(process.env.VUE_APP_POSTHOG_KEY)
  );
}

function canCapture(): boolean {
  return isAnalyticsEnabled() && initialized && hasAnalyticsConsent();
}

export function initAnalytics(): void {
  if (!isAnalyticsEnabled() || initialized || typeof window === "undefined") {
    return;
  }

  const apiHost = process.env.VUE_APP_POSTHOG_HOST || "/ingest";

  posthog.init(process.env.VUE_APP_POSTHOG_KEY as string, {
    api_host: apiHost,
    autocapture: false,
    capture_pageview: false,
    persistence: "localStorage+cookie",
    opt_out_capturing_by_default: !hasAnalyticsConsent(),
  });

  initialized = true;
}

export async function bootstrapAnalyticsIdentity(): Promise<void> {
  if (!canCapture()) {
    return;
  }

  const userId = await fetchCurrentUserId();
  if (userId !== null) {
    posthog.identify(userId);
  }
}

export function capturePageview(path: string): void {
  if (!canCapture()) {
    return;
  }

  posthog.capture("$pageview", {
    surface: HUB_SURFACE,
    $current_url: path,
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
}): void {
  captureHubEvent("pack_rerun", properties);
}

export function setOrganizationGroup(
  orgId: number,
  orgName?: string
): void {
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
  accountId: number,
  org: { id: number; Name: string } | null,
  sport?: string
): void {
  trackHubOpened(accountId, sport);

  if (org) {
    setOrganizationGroup(org.id, org.Name);
  }
}

export function resetAnalytics(): void {
  if (!initialized) {
    return;
  }

  posthog.reset();
}

export function getPostHogClient(): typeof posthog | null {
  return initialized ? posthog : null;
}
