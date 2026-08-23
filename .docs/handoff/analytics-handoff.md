# Analytics handoff — App & Hub teams

**Date:** 2026-08-23  
**From:** Marketing / platform  
**PostHog project:** `214725` (shared across all Fixtura surfaces)  
**Hub implementation:** `fixtura-content-hub` (this repo) — PR pending

## Request

Implement client analytics on App and Hub using the **same PostHog project key** as the marketing site so we can stitch journeys from first pageview through Delivery Hub usage.

## What you need to read

| Doc | Path (marketing repo) |
| --- | --- |
| Spec | `.docs/analytics/Fixtura-Analytics-Spec.md` |
| Event catalog | `.docs/analytics/event-catalog.md` |
| Implementation | `.docs/analytics/implementation-guide.md` |
| Dashboards | `.docs/analytics/dashboards.md` |

Clone or browse: `fixtura/marketing` on branch `staging`.

## Decisions (settled)

1. **One project** — not separate marketing vs product projects.
2. **`surface` on every event** — `marketing_site`, `app`, or `hub`. Hub = this Vue Content Hub app (all routes `surface: hub`).
3. **`identify(backendUserId)`** on login/register — never email. Hub calls `GET /users/me` (cookie session) on boot.
4. **`group("organization", orgId)`** using `accountOrganisationDetails.id` when account loads.
5. **Explicit events** — no autocapture for product funnels.
6. **Shared consent** — cookie `fixtura_analytics_consent` on `Domain=.fixtura.com.au` (not localStorage; subdomains do not share localStorage).
7. **Sentry stays** for errors — not PostHog exception capture.
8. **Server events** for `account_created`, `email_verified`, `first_pack_delivered` (API team). API must use backend user id as `distinct_id` from creation so client `identify()` aliases correctly.
9. **GA retired** on Hub — PostHog replaces `vue-gtag`.
10. **Pack** = Render. **Hub** = this repo.

## Hub deliverables (this repo)

- [x] Env vars: `VUE_APP_POSTHOG_KEY`, `VUE_APP_FEATURE_ANALYTICS`, optional `VUE_APP_POSTHOG_HOST` (default `/ingest`)
- [x] Init via `src/lib/analytics/` (`posthog-js`, consent cookie gate, no autocapture)
- [x] Dev `/ingest` proxy in `vue.config.js`
- [x] `$pageview` with `surface: hub` on router navigation
- [x] `identify()` via `/users/me` (`VUE_APP_AUTH_ME_PATH` override)
- [x] `group("organization", …)` on account load
- [x] `reset()` on logout
- [x] Catalog events: `hub_opened`, `pack_viewed`, `asset_downloaded`, `pack_rerun`
- [x] `CONTEXT.md` glossary
- [ ] PR link (fill on merge)

### Hub event triggers

| Event | Trigger | Properties |
| --- | --- | --- |
| `hub_opened` | First `AccountView` load per session | `account_id`, `sport` |
| `pack_viewed` | Enter `RenderView` | `render_id`, `account_id` |
| `asset_downloaded` | Successful image/video download | `asset_id`, `render_id`, `account_id`, `asset_type` |
| `pack_rerun` | Successful asset rerender API **or** pack rerender request | `asset_id` / `render_id`, `account_id`, `trigger` |

## App team (separate Next.js repo)

- [ ] `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_FEATURE_ANALYTICS`
- [ ] Init + `/ingest` proxy
- [ ] Consent cookie (shared with marketing)
- [ ] `$pageview` with `surface: app`
- [ ] `identify()` + `conversion` `login_success` on auth
- [ ] `reset()` on logout
- [ ] Onboarding catalog events
- [ ] PR updates `event-catalog.md` for any new events

## API / Strapi team

- [ ] `POSTHOG_API_KEY` in server env only
- [ ] Server capture for lifecycle events in catalog
- [ ] `GET /users/me` (or equivalent) returning backend `user.id` for Hub `identify()`
- [ ] Server events use backend user id as `distinct_id` from `account_created` onward

## Marketing status (reference)

- Live: `$pageview`, `cta_clicked`, `conversion`, `form_submitted`, `user_action`
- `identify()` on register success (backend user id)
- QA: `.docs/TESTING.md` PostHog section

## Verification

Joint QA session: one user journey from marketing pricing → register → App login → Hub download, single person in PostHog with events across `marketing_site`, `app`, and `hub`.

Checklist:

1. Consent cookie set on marketing propagates to Hub (same `.fixtura.com.au` domain).
2. `identify()` merges anonymous pre-login events after App login / Hub boot.
3. Server `account_created` shares `distinct_id` with client `identify()`.
4. Hub events carry `surface: hub` and org group.

## Contact

Update PR links when App/Hub analytics ships.
