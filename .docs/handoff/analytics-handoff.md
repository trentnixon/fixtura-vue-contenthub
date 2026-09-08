# Analytics handoff — App & Hub teams

**Date:** 2026-08-23 (updated 2026-09-08)  
**From:** Marketing / platform  
**PostHog project:** `214725` (shared across all Fixtura surfaces)  
**Hub implementation:** `fixtura-content-hub` (this repo) — see `.scratch/hub-analytics/`

## Request

Implement client analytics on App and Hub using the **same PostHog project key** as the marketing site so we can stitch journeys from first pageview through Delivery Hub usage.

## Decisions (settled)

1. **One project** — not separate marketing vs product projects.
2. **`surface` on every event** — `marketing_site`, `app`, or `hub`. Hub = this Vue Content Hub app (all routes `surface: hub`).
3. **`identify(backendUserId)`** — App/marketing only. Hub does **not** call `identify()`; route params define context.
4. **`group("organization", orgId)`** using Organisation id when Account Organisation details load (including deep-links via Account layout).
5. **Explicit events** — no autocapture for product funnels.
6. **Hub consent** — Hub does **not** gate on `fixtura_analytics_consent`. Capture runs when `NEXT_PUBLIC_FEATURE_ANALYTICS=true` and the PostHog key is set (same as members app). Marketing www keeps its own banner; unchanged.
7. **Sentry stays** for errors — not PostHog exception capture.
8. **GA retired** on Hub — PostHog replaces `vue-gtag`.
9. **Pack** = Render. **Hub** = this repo.

## Hub deliverables (this repo)

- [x] Env vars: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_FEATURE_ANALYTICS`, optional `NEXT_PUBLIC_POSTHOG_HOST` (default `/ingest`)
- [x] Init via analytics module (`posthog-js`, feature-flag gate, no autocapture)
- [x] Dev `/ingest` proxy in Vue CLI config (`/ingest/static`, `/ingest/array`, `/ingest`)
- [x] Router-centralised `$pageview` + funnel events with route context registered
- [x] Organization group on Account Organisation load
- [x] Catalog events (see table)
- [x] `CONTEXT.md` glossary
- [x] Spec + tickets under `.scratch/hub-analytics/`

### Hub event catalog

All events include `surface: hub`. Route-derived properties are attached via `posthog.register()` on navigation and on `$pageview`.

| Event | Trigger | Key properties |
| --- | --- | --- |
| `$pageview` | Every route change | path + route context |
| `hub_opened` | Navigate to `/:accountid` (once per session) | `account_id`, optional `sport` |
| `pack_viewed` | Pack (Render) route | `render_id`, `account_id` |
| `category_viewed` | Grouping category route | `grouping_category`, `render_id`, `account_id` |
| `asset_viewed` | Asset route | `asset_type`, `grouping_category`, `render_id`, `account_id` |
| `asset_edit_opened` | Editor route | `asset_type`, `render_id`, `account_id` |
| `asset_edit_saved` | Successful CMS save | `download_id`, `asset_type`, `render_id`, `account_id` |
| `asset_downloaded` | Successful image/video/bulk download | `asset_id`, `render_id`, `account_id`, `asset_type` |
| `pack_rerun` | Asset rerender success or pack rerender request | `trigger`, `reason` (pack), ids |
| `roster_sync_requested` | Confirm PlayHQ sync | `render_id`, `account_id`, `grouping_category` |
| `roster_create_requested` | Confirm create roster | `render_id`, `account_id`, `grouping_category` |

### Not tracked (by design)

- Button clicks / UI chrome (no autocapture)
- User `identify()`
- API errors / polling (Sentry)
- Home `/` as funnel start

## Ship checklist (Hub)

1. Set `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_FEATURE_ANALYTICS=true`, optional `NEXT_PUBLIC_POSTHOG_HOST`.
2. Prod `/ingest` reverse proxy on the Hub host — three nginx locations: `/ingest/static/`, `/ingest/array/`, `/ingest/` (see PostHog nginx proxy docs).
3. Smoke test: `GET /ingest/decide?v=3` → JSON (not 404/HTML).
4. Joint QA: App login → Hub Account → Pack → Asset → download; events show `surface: hub` and org group; same browser session stitches via PostHog cross-subdomain cookie when app calls `identify()`.
5. Sync marketing `event-catalog.md` with Hub catalog above (external).

## App / API (external — out of Hub scope)

- App `identify()` / `login_success` / `reset()` on logout
- Marketing consent UI + marketing `event-catalog.md` PR
- API/Strapi server capture (`account_created`, `email_verified`, `first_pack_delivered`)
- Production CDN/nginx `/ingest` reverse proxy on Hub host

## Contact

Update PR links when Hub analytics ships.
