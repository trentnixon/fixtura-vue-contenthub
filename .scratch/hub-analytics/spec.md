# Hub Analytics (PostHog) — Spec

**Status:** ready-for-agent  
**Feature slug:** `hub-analytics`  
**PostHog project:** `214725` (shared across Fixtura surfaces)  
**Surface:** `hub`

## Problem Statement

Product and marketing need a single PostHog project that can follow a journey from the marketing site through the App and into the Content Hub (delivery). Hub today either had no PostHog coverage, or incomplete coverage of the real delivery funnel (Account → Pack → category → Asset → download / edit / roster / rerun). Without Hub events and shared route context, funnels break at delivery and teams keep returning to add tracking later.

## Solution

Ship set-and-forget client analytics on Hub: same project key as marketing/App, consent-gated capture, explicit catalog events only (no autocapture), route-derived context on every event, Organization group when Account data loads. No User `identify()` — Hub is route-scoped. Retire Google Analytics on Hub. Verify and finish the implementation already started in this repo so the Hub catalog is complete and documented.

## User Stories

1. As a product analyst, I want every Hub event tagged with `surface: hub`, so that I can filter Hub usage from App and marketing in one project.
2. As a product analyst, I want Hub to use the same PostHog project as marketing and App, so that browser sessions can stitch across surfaces.
3. As a privacy-conscious club admin, I want Hub to respect the shared Fixtura analytics consent cookie, so that tracking only runs when consent is granted.
4. As a Hub visitor without consent, I want no analytics events to fire, so that my preference is honoured.
5. As an engineer, I want analytics behind a feature flag env var, so that Hub can be deployed with tracking off until keys and consent are ready.
6. As an engineer, I want the same `NEXT_PUBLIC_POSTHOG_*` env names as App/marketing, so that ops does not maintain Hub-specific analytics env vocabulary.
7. As a product analyst, I want `$pageview` on every Hub route change, so that I can see navigation volume and drop-off.
8. As a product analyst, I want `$pageview` enriched with Account, Pack, sport, grouping category, and Asset type when present in the URL, so that pageviews are segmentable without joining other events.
9. As a product analyst, I want subsequent Hub events to inherit registered route context, so that I do not lose Account/Pack/Asset dimensions on action events.
10. As a club admin opening Hub via `/:accountid`, I want `hub_opened` once per session, so that Hub entry is countable without spam on every Account remount.
11. As a product analyst, I want `pack_viewed` when a Pack (Render) route is opened, so that I can see which weekly bundles are used.
12. As a product analyst, I want `category_viewed` when a grouping category route is opened, so that I can see which grades/categories are explored.
13. As a product analyst, I want `asset_viewed` when an Asset route is opened, so that I can see which Asset types are inspected.
14. As a product analyst, I want `asset_edit_opened` when the editor route is opened, so that I can measure edit intent.
15. As a club admin saving edits, I want `asset_edit_saved` on successful CMS save, so that completed edits are measurable.
16. As a club admin downloading video or images, I want `asset_downloaded` on successful download (including bulk), so that delivery value is measurable.
17. As a product analyst, I want downloads from every download UI (including single-game result galleries) tracked, so that no download path is invisible.
18. As a club admin requesting a Pack rerun, I want `pack_rerun` with `trigger: pack_request` and a reason, so that support themes are visible.
19. As a club admin applying Asset edits that trigger a rerender, I want `pack_rerun` with `trigger: asset`, so that edit-driven reruns are separable from pack-level requests.
20. As a club admin confirming PlayHQ roster sync, I want `roster_sync_requested`, so that sync intent is countable.
21. As a club admin confirming create roster, I want `roster_create_requested`, so that create intent is countable.
22. As a product analyst, I want Organization grouped in PostHog when Account Organisation details load, so that Hub usage can be rolled up by org.
23. As a product analyst, I do not want Hub to call `identify()` with a User id, so that Hub stays honest about being route-scoped and not an auth surface.
24. As an engineer, I want Google Analytics removed from Hub, so that we do not double-track or maintain two analytics stacks.
25. As an engineer, I want autocapture disabled, so that product funnels stay explicit and the catalog stays the contract.
26. As an engineer, I want errors and polling failures left to Sentry, so that PostHog is not used as an error tracker.
27. As an engineer, I want unit tests against the analytics public API only, so that behaviour is locked without brittle UI tests.
28. As a marketing/platform owner, I want the Hub event catalog documented in the Hub handoff, so that App/marketing can sync their catalog without reading Hub source.
29. As a QA lead, I want a joint-journey checklist (marketing → App → Hub download), so that cross-surface stitch can be verified once.
30. As an engineer shipping later routes, I want funnel events driven primarily from the router, so that new Hub routes inherit tracking without per-page rework.
31. As a product analyst, I want Home `/` not treated as the start of the Hub funnel, so that real delivery starts at Account.
32. As an ops engineer, I want optional PostHog host configuration (including `/ingest` proxy in dev), so that ad-blocker impact can be reduced when infra is ready.
33. As a club admin deep-linking straight to an Asset URL, I want the correct funnel event for that route depth, so that deep links are not missing from funnels.
34. As a product analyst, I want `surface: hub` on every catalog event including `$pageview`, so that dashboards never mix Hub with other surfaces by accident.

## Implementation Decisions

- One shared PostHog project across marketing, App, and Hub; Hub always emits `surface: hub`.
- Hub is not an auth application: no User `identify()`, no `/users/me` bootstrap, no `reset()` on Hub logout stubs. Context comes from the route (`accountid`, `renderid`, grouping category, Asset type) and from Account Organisation when loaded.
- Consent is the shared cookie `fixtura_analytics_consent` on `.fixtura.com.au` (not localStorage alone). Capture is opt-out until consent is granted.
- Env vars are `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_FEATURE_ANALYTICS`. Vue CLI must inject `NEXT_PUBLIC_*` into the client bundle (Vue only auto-exposes `VUE_APP_*`).
- Init uses `posthog-js` with autocapture off and automatic pageview off; Hub owns `$pageview`.
- Primary navigation funnel is router-centralised: parse Hub route → register route properties → `$pageview` → depth-appropriate catalog event (`hub_opened` | `pack_viewed` | `category_viewed` | `asset_viewed` | `asset_edit_opened`).
- `hub_opened` is once per browser session.
- Organization PostHog group uses Organisation id from Account details when Account loads.
- Action events wire at success/intent seams: download helpers (all download UIs), editor save success, Asset/pack rerun success, roster confirm actions.
- `pack_rerun` distinguishes `trigger: asset` vs `trigger: pack_request`; pack requests include `reason` when available.
- Google Analytics (`vue-gtag` / Hub GA helpers) is removed; PostHog replaces it for Hub product analytics.
- Domain glossary terms (Surface, Hub, Pack, Account, Organization, User) live in root `CONTEXT.md` and must be used in tickets and dashboards.
- Tickets in this effort are **verify + finish**: much of the implementation may already exist; agents must meet acceptance criteria, close gaps, and leave docs aligned — not rebuild from scratch unless broken.

## Testing Decisions

- A good test asserts external behaviour of the analytics module (consent, feature flag, route parsing, which event/properties would be emitted), not Vue component internals or PostHog network payloads.
- Prefer mocking the capture client / gating functions at the analytics public API seam.
- Modules under test: analytics public API (consent, feature enablement, route context parsing, router funnel mapping where testable without mounting the app).
- Prior art: existing unit tests under `tests/unit/analytics/` for consent, feature flag, and route context.
- Manual / joint QA covers end-to-end: consent propagation, org group, download/edit/roster/rerun events in PostHog Live, and cross-surface stitch when App/marketing are ready.

## Out of Scope

- App (Next.js) analytics implementation and App `identify()` / login conversion events.
- Marketing site consent UI implementation (Hub only consumes the shared cookie).
- API/Strapi server-side PostHog capture (`account_created`, `email_verified`, `first_pack_delivered`).
- Production CDN/nginx `/ingest` reverse proxy (document requirement; infra-owned).
- Autocapture, session replay product setup, heatmaps configuration, or PostHog dashboard creation in the PostHog UI.
- User identity on Hub; email-based identifiers.
- Tracking button chrome, generic UI clicks, Home `/` as funnel start, or Sentry-equivalent error events in PostHog.
- Publishing or updating the marketing repo `event-catalog.md` (Hub handoff documents Hub events for others to sync).

## Further Notes

- Shared project id: `214725`.
- Pack = Render in Hub domain language.
- If marketing still writes consent only to localStorage, Hub capture will stay off on Hub’s origin until the cookie contract is live — call that out in ship checklist, do not reintroduce localStorage as the Hub source of truth.
- Preferred test seam (confirmed): analytics public API only.
