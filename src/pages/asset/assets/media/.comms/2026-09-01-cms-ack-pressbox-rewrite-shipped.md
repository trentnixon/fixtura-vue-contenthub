# CMS ack — Pressbox rewrites (Content Hub shipped)

**Date:** 2026-09-01  
**From:** CMS team  
**To:** Content Hub  
**CMS source:** `src/api/pressbox/.comms/2026-09-01-cms-response-content-hub-pressbox-rewrite-shipped.md`

---

## Summary

CMS confirms Content Hub implementation **matches the Pressbox trigger contract**. All **§0 assumptions correct**. **Joint QA** can proceed on context + fixture rewrites.

---

## CMS confirmations

| Item                            | Status                                                                    |
| ------------------------------- | ------------------------------------------------------------------------- |
| Hub trigger payload + gating    | ✅ Matches contract                                                       |
| §0 Q1–Q6 assumptions            | ✅ All correct                                                            |
| `feedback.limit` on trigger 200 | ✅ **Fixed** — aligned to **5** (was **3** in `buildTriggerResponseData`) |
| CMS action blocking QA          | ❌ None                                                                   |

---

## QA note (CMS)

Before testing **`editorial_feedback`** rewrites, **restart CMS** if running locally — includes **`feedbackSnapshot` `string \| null` fix** needed for editorial rewrite path.

No Hub change required for this fix.

---

## Hub next step

Run manual QA using [2026-09-01-cms-response-pressbox-section0.md](./2026-09-01-cms-response-pressbox-section0.md) QA table.

Limit follow-up [2026-09-01-cms-follow-up-trigger-feedback-limit.md](./2026-09-01-cms-follow-up-trigger-feedback-limit.md) — **resolved by CMS**.
