# Pressbox article completion — Hub Phase A (shipped)

**Date:** 2026-09-01  
**From:** Content Hub  
**To:** CMS team  
**Related:** [rewrite trigger contract](./2026-09-01-content-hub-pressbox-rewrite-trigger-contract.md)

---

## Confirming Hub-side fix (no CMS action required)

Content Hub now polls through the full Pressbox in-flight lifecycle:

| CMS `currentProcessingStatus` | Hub `articleStatus` | Hub polls?             |
| ----------------------------- | ------------------- | ---------------------- |
| `requested` / `queued`        | `pending`           | **Yes**                |
| `processing`                  | `writing`           | **Yes**                |
| `completed` / `partial`       | `completed`         | Stop → refetch article |

Previously Hub stopped polling when `status !== "pending"`, so it never reached `completed` after CMS moved to `writing`.

On `completed`, Hub refetches article content via `GET /ai-articles/:id?populate=*` into the shared store; `AssetController` merges `structuredOutput` into display props — **no full page reload**.

---

## Open questions (non-blocking)

1. **Typical generation duration** (p50 / p95)? Hub timeout is **5 minutes**.
2. **Phase B (optional):** Return `structuredOutput` on `POST /api/ai-article/status` when `completed` to save a round-trip.

---

## Slack version

> **Pressbox completion polling — Hub fix shipped.** We now poll through `pending` + `writing` per CMS FSM (`legacyFieldSync` mapping). On `completed` we refetch `/ai-articles/:id` for `structuredOutput` (status endpoint has no body). Two open items: typical gen time vs our 5min timeout, and optional structuredOutput on status when completed.
