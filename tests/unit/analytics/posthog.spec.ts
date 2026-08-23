import { isAnalyticsEnabled } from "@/lib/analytics";

describe("analytics feature flag", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("is disabled when feature flag is off", () => {
    process.env.NEXT_PUBLIC_FEATURE_ANALYTICS = "false";
    process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test";

    expect(isAnalyticsEnabled()).toBe(false);
  });

  it("is enabled when feature flag and key are set", () => {
    process.env.NEXT_PUBLIC_FEATURE_ANALYTICS = "true";
    process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test";

    expect(isAnalyticsEnabled()).toBe(true);
  });

  it("is disabled when PostHog key is missing", () => {
    process.env.NEXT_PUBLIC_FEATURE_ANALYTICS = "true";
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;

    expect(isAnalyticsEnabled()).toBe(false);
  });
});
