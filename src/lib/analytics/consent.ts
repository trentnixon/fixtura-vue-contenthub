export const CONSENT_COOKIE_NAME = "fixtura_analytics_consent";

const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );

  return match ? decodeURIComponent(match[1]) : null;
}

export function getConsentCookieDomain(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.location.hostname.endsWith("fixtura.com.au")
    ? ".fixtura.com.au"
    : undefined;
}

export function getAnalyticsConsent(): boolean | null {
  const value = readCookie(CONSENT_COOKIE_NAME);

  if (value === "granted") {
    return true;
  }

  if (value === "denied") {
    return false;
  }

  return null;
}

export function setAnalyticsConsent(granted: boolean): void {
  if (typeof document === "undefined") {
    return;
  }

  const value = granted ? "granted" : "denied";
  const domain = getConsentCookieDomain();
  const domainAttribute = domain ? `; Domain=${domain}` : "";

  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${domainAttribute}${
    window.location.protocol === "https:" ? "; Secure" : ""
  }`;
}

export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsent() === true;
}
