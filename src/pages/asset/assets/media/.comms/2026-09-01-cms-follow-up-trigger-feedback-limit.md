# CMS follow-up — align trigger `feedback.limit` default

**Date:** 2026-09-01  
**From:** Content Hub  
**To:** CMS team  
**Priority:** Low (QA polish; does not block rewrite triggers)  
**Related:** [2026-09-01-content-hub-pressbox-rewrite-trigger-contract.md](./2026-09-01-content-hub-pressbox-rewrite-trigger-contract.md) § Status endpoint

---

## Ask

Align **`feedback.limit`** in **`buildTriggerResponseData`** (trigger **200** path) with the status endpoint default (**5**).

Today:

| Endpoint                                                            | `feedback.limit` default (observed) |
| ------------------------------------------------------------------- | ----------------------------------- |
| `POST /api/ai-article/status`                                       | **5**                               |
| `POST /api/ai-article/trigger` success (`buildTriggerResponseData`) | **3**                               |

Content Hub gates “Request a Review” using **`feedback.count >= feedback.limit`** from whichever response updated state last. A trigger **200** can briefly show a lower limit than status polling, causing the rewrite button to disable early or show inconsistent remaining counts.

---

## Suggested fix

In `buildTriggerResponseData`, use the same limit source/constant as the status handler (prefer **5** unless product says otherwise). After deploy, trigger and status should return matching `feedback.limit` for the same article.

---

## Hub workaround (until fixed)

We rely primarily on **status poll** for gating after the first status fetch. Mismatch may still appear immediately after trigger **200** before the next poll — acceptable for v1 if fix is queued.

---

## Verify

1. Complete article → trigger rewrite with valid `requestReason` → note `feedback.limit` on **200**.
2. Poll status → `feedback.limit` should match trigger response.
3. Repeat at `count` near limit — button disable timing should match status, not trigger-only default.

---

## Slack version

> **Small CMS ask:** `buildTriggerResponseData` returns `feedback.limit: 3` but status defaults to **5**. Can we align trigger success to the same limit source? Hub gates rewrites on count/limit and gets a brief mismatch right after trigger 200. Low priority — rewrites work; this is QA/consistency.
