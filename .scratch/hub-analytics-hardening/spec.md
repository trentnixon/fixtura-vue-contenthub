# Hub Analytics Hardening — Spec

**Status:** ready-for-agent  
**Feature slug:** `hub-analytics-hardening`  
**Parent:** `.scratch/hub-analytics/spec.md`  
**Surface:** `hub`

## Problem Statement

Hub already ships the PostHog catalog from the hub-analytics effort, but a code review found three accuracy gaps: consent granted after boot may not re-enable the SDK; `asset_edit_saved` can fire when a CMS save failed; and asset-triggered `pack_rerun` can fire when the rerender API did not succeed. Analysts and support therefore risk trusting counts that include failed outcomes or missing mid-session consent.

## Solution

Harden Hub analytics so catalog action events mean what the original Hub Analytics spec promised: capture only when consent is (or becomes) granted, and emit `asset_edit_saved` / asset `pack_rerun` only after a real successful CMS/API outcome. Keep the existing analytics public API and downloads-store seams; do not rebuild the catalog or expand into standards-only refactors (download call-site sprawl, rename churn).

## User Stories

1. As a privacy-conscious club admin, I want Hub to start capturing after I grant analytics consent mid-session, so that my preference is honoured without a full page reload.
2. As a club admin who denied consent, I want Hub to keep capture off until I grant it, so that my preference stays enforced.
3. As a product analyst, I want `asset_edit_saved` only when a CMS save actually succeeded, so that edit completion rates are not inflated by failures.
4. As a club admin whose edit save fails, I want no `asset_edit_saved` event, so that failed work is not counted as delivery value.
5. As a product analyst, I want asset-triggered `pack_rerun` only when the rerender request succeeds, so that edit-driven Pack reruns are trustworthy.
6. As a club admin whose Asset rerender fails, I want no `pack_rerun` with `trigger: asset`, so that failed retries are not counted as Pack activity.
7. As a product analyst, I want Pack-level `pack_rerun` with `trigger: pack_request` to remain gated on successful pack request submission, so that both Pack rerun triggers stay consistent about “success”.
8. As an engineer, I want success gating owned at the downloads store (or equivalent success seam) for Asset save and Asset rerender, so that UI composables cannot accidentally track after a swallowed error.
9. As an engineer, I want unit tests on the analytics public API for consent → capture enablement after init, so that mid-session opt-in cannot regress without a failing test.
10. As an engineer, I want unit tests on downloads store actions (with mocked track helpers) for save and Asset rerender, so that failed API outcomes cannot emit catalog events without a failing test.
11. As a product analyst, I still want every Hub event tagged with `surface: hub`, so that hardened events stay filterable with the rest of Hub.
12. As a product analyst, I still do not want Hub to call `identify()` with a User id, so that Hub remains route-scoped.
13. As an engineer, I want existing router funnel, Organization group, download, and roster catalog behaviour left unchanged except where success/consent gating requires it, so that hardening does not reopen the full catalog.
14. As a QA lead, I want failed save and failed Asset rerender to show no corresponding Live events when consent is on, so that I can verify the fix without reading source.
15. As a QA lead, I want granting consent after Hub load (when the shared cookie appears) to allow subsequent catalog events, so that mid-session consent is verifiable.
16. As an engineer shipping later, I want `setAnalyticsConsent` kept as a test/support helper on the analytics API without building a Hub consent UI, so that Hub still only consumes the shared cookie contract in production.
17. As a marketing/platform owner, I want the handoff catalog semantics for `asset_edit_saved` and `pack_rerun` to stay “on success”, so that App/marketing docs do not need a meaning change—only Hub behaviour catching up.
18. As an engineer, I want errors and polling failures left to Sentry, so that PostHog is still not used as an error tracker.
19. As a product analyst, I want `trigger: asset` vs `trigger: pack_request` preserved on `pack_rerun`, so that edit-driven and pack-level requests remain separable.
20. As a club admin, I want edit and rerun UX behaviour unchanged when analytics is off or consent denied, so that hardening does not alter delivery workflows.

## Implementation Decisions

- Scope is hardening only: consent mid-session enablement, `asset_edit_saved` success gate, Asset `pack_rerun` success gate. No catalog redesign, no GA reintroduction, no User `identify()`.
- Consent: when the shared `fixtura_analytics_consent` cookie becomes granted after `initAnalytics`, Hub must opt the PostHog SDK back in (or otherwise make `canCapture`-equivalent paths actually capture). Boot-time `opt_out_capturing_by_default` alone is not enough.
- Prefer owning Asset save tracking on the downloads store success path (or returning a clear success/failure to the caller before tracking) so a swallowed CMS error cannot emit `asset_edit_saved`.
- Asset `pack_rerun` must require a successful rerender API outcome (not merely a truthy response object); keep `trigger: asset` and route/Account/Pack context properties as today.
- Pack-request `pack_rerun` remains behind the existing successful submission path on the Pack (Render) request flow; only change it if review proves it fires on failure.
- Domain vocabulary from root `CONTEXT.md`: Surface, Hub, Pack (Render), Account, Organization, User (not identified on Hub).
- Do not treat code-smell cleanup (download call-site duplication, renaming `onAccountLoaded`, trimming unused surface union members) as in-scope unless required to land a success gate cleanly.
- Do not add a Hub consent UI; Hub continues to consume the shared cookie. Cookie writer helpers for tests remain acceptable.

## Testing Decisions

- Good tests assert external behaviour: which catalog events fire (or do not) under consent and success/failure outcomes—not PostHog network payloads or Vue template internals.
- Primary seam: analytics public API — consent grant after init enables capture; deny keeps capture off. Prior art: existing unit tests under `tests/unit/analytics/` for consent and posthog gating.
- Secondary seam: downloads store actions for `saveFixturaAsset` and Asset `triggerRerender`, with `track*` helpers mocked — assert emit only on success. Prefer this over mounting edit/rerender UI.
- One seam is ideal; two are accepted because call-site success gating cannot be proven at the analytics API alone.
- Manual / Live check: with consent on, fail a save and fail an Asset rerender and confirm no `asset_edit_saved` / asset `pack_rerun`; grant consent mid-session and confirm a subsequent Hub event appears.

## Out of Scope

- Rebuilding the Hub event catalog or router funnel.
- Download tracking call-site consolidation / Shotgun Surgery cleanup.
- Hub consent UI or marketing cookie implementation.
- App/marketing analytics, server-side PostHog, dashboards, autocapture, session replay.
- User `identify()` on Hub.
- Updating marketing repo catalogs beyond noting Hub behaviour now matches “on success”.
- Agent-docs / AGENTS.md / issue-tracker scaffolding changes.

## Further Notes

- Originating review: code-review of `5fadfd4...HEAD` against `.scratch/hub-analytics/spec.md` (Standards smells optional; Spec findings drive this work).
- Shared PostHog project `214725`; Hub always emits `surface: hub`.
- Confirmed seams (user-approved): (1) `@/lib/analytics` public API for consent sync; (2) downloads store actions with mocked track helpers for success-gated save and Asset rerender.
