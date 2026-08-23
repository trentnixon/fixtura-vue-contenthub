# 01 — Analytics foundation — init, consent, env, GA retire

**Status:** resolved  
**Blocked by:** None — can start immediately

**What to build:** Hub can initialise PostHog behind the shared `NEXT_PUBLIC_*` env vars and the Fixtura analytics consent cookie, with autocapture off. Google Analytics is fully retired from Hub so product analytics has a single path. Feature flag off or missing key means no capture.

- [x] `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, and `NEXT_PUBLIC_FEATURE_ANALYTICS` are read by Hub client code (Vue bundle injection included if required)
- [x] PostHog init runs only when the feature flag is on and a key is present
- [x] Capture is gated on consent cookie granted; denied/absent means no events
- [x] Autocapture and automatic `$pageview` are disabled at init
- [x] Google Analytics / `vue-gtag` / Hub GA helpers are removed and not referenced
- [x] Unit tests at the analytics public API cover feature flag enablement and consent gating
- [x] Verify-and-finish: reuse existing module work; only fill gaps against these criteria

## Comments
