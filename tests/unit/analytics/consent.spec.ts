import {
  CONSENT_COOKIE_NAME,
  getAnalyticsConsent,
  getConsentCookieDomain,
  hasAnalyticsConsent,
  setAnalyticsConsent,
} from "@/lib/analytics";

describe("analytics consent", () => {
  beforeEach(() => {
    document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0`;
  });

  it("returns null when consent cookie is absent", () => {
    expect(getAnalyticsConsent()).toBeNull();
  });

  it("returns true when consent cookie is granted", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=granted; Path=/`;

    expect(getAnalyticsConsent()).toBe(true);
    expect(hasAnalyticsConsent()).toBe(true);
  });

  it("returns false when consent cookie is denied", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=denied; Path=/`;

    expect(getAnalyticsConsent()).toBe(false);
    expect(hasAnalyticsConsent()).toBe(false);
  });

  it("writes granted consent to the cookie", () => {
    setAnalyticsConsent(true);

    expect(getAnalyticsConsent()).toBe(true);
  });

  it("omits cross-subdomain domain on localhost", () => {
    expect(getConsentCookieDomain()).toBeUndefined();
  });
});
