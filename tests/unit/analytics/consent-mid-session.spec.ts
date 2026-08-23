import { CONSENT_COOKIE_NAME } from "@/lib/analytics";

jest.mock("posthog-js", () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    capture: jest.fn(),
    opt_in_capturing: jest.fn(),
    opt_out_capturing: jest.fn(),
    group: jest.fn(),
  },
}));

describe("analytics consent mid-session", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_FEATURE_ANALYTICS: "true",
      NEXT_PUBLIC_POSTHOG_KEY: "phc_test",
    };
    document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0`;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  async function load() {
    const posthog = (await import("posthog-js")).default;
    const analytics = await import("@/lib/analytics/posthog");
    const consent = await import("@/lib/analytics/consent");
    jest.clearAllMocks();
    return { posthog, analytics, consent };
  }

  it("captures after consent is granted following init without consent", async () => {
    const { posthog, analytics, consent } = await load();

    analytics.initAnalytics();
    analytics.captureHubEvent("hub_opened", { account_id: 1 });
    expect(posthog.capture).not.toHaveBeenCalled();

    consent.setAnalyticsConsent(true);
    analytics.captureHubEvent("hub_opened", { account_id: 1 });

    expect(posthog.opt_in_capturing).toHaveBeenCalled();
    expect(posthog.capture).toHaveBeenCalledWith(
      "hub_opened",
      expect.objectContaining({ surface: "hub", account_id: 1 })
    );
  });

  it("does not capture when consent remains denied after init", async () => {
    const { posthog, analytics, consent } = await load();

    analytics.initAnalytics();
    consent.setAnalyticsConsent(false);
    analytics.captureHubEvent("hub_opened", { account_id: 1 });

    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
