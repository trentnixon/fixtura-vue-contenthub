import { isAnalyticsEnabled } from "@/lib/analytics/posthog";

describe("analytics feature flag", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("is disabled when feature flag is off", () => {
    process.env.VUE_APP_FEATURE_ANALYTICS = "false";
    process.env.VUE_APP_POSTHOG_KEY = "phc_test";

    expect(isAnalyticsEnabled()).toBe(false);
  });

  it("is enabled when feature flag and key are set", () => {
    process.env.VUE_APP_FEATURE_ANALYTICS = "true";
    process.env.VUE_APP_POSTHOG_KEY = "phc_test";

    expect(isAnalyticsEnabled()).toBe(true);
  });
});
