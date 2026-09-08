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

describe("initAnalytics", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_FEATURE_ANALYTICS: "true",
      NEXT_PUBLIC_POSTHOG_KEY: "phc_test",
    };
    delete process.env.NEXT_PUBLIC_POSTHOG_HOST;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  async function load() {
    const posthog = (await import("posthog-js")).default;
    const analytics = await import("@/lib/analytics/posthog");
    jest.clearAllMocks();
    return { posthog, analytics };
  }

  it("initialises PostHog with defaults version and ingest proxy host", async () => {
    const { posthog, analytics } = await load();

    analytics.initAnalytics();

    expect(posthog.opt_in_capturing).toHaveBeenCalled();
    expect(posthog.init).toHaveBeenCalledWith("phc_test", {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2026-05-30",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      persistence: "localStorage+cookie",
    });
  });

  it("uses NEXT_PUBLIC_POSTHOG_HOST when set", async () => {
    process.env.NEXT_PUBLIC_POSTHOG_HOST = "https://us.i.posthog.com";
    const { posthog, analytics } = await load();

    analytics.initAnalytics();

    expect(posthog.init).toHaveBeenCalledWith(
      "phc_test",
      expect.objectContaining({
        api_host: "https://us.i.posthog.com",
        defaults: "2026-05-30",
      })
    );
  });

  it("does not initialise when analytics is disabled", async () => {
    process.env.NEXT_PUBLIC_FEATURE_ANALYTICS = "false";
    const { posthog, analytics } = await load();

    analytics.initAnalytics();

    expect(posthog.init).not.toHaveBeenCalled();
  });

  it("captures events when analytics is enabled without a consent gate", async () => {
    const { posthog, analytics } = await load();

    analytics.initAnalytics();
    analytics.captureHubEvent("hub_opened", { account_id: 1 });

    expect(posthog.capture).toHaveBeenCalledWith(
      "hub_opened",
      expect.objectContaining({ surface: "hub", account_id: 1 })
    );
  });
});
