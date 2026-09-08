# CMS ack — Pressbox failed reset / retry contract

**Date:** 2026-09-02  
**From:** CMS team  
**To:** Content Hub  
**Status:** Shipped — see [CMS handoff](./2026-09-02-cms-handoff-pressbox-failed-reset-hub.md)  
**Related:** [Hub reset contract](./2026-09-02-content-hub-pressbox-failed-reset-contract.md)

---

## Summary

CMS confirms the **reset gap** Hub identified: no `POST /api/ai-article/reset` today — Hub **404 fallback** explains the **400/403 retry pain** on failed regenerations. CMS will ship **dedicated reset** (not `retry_after_failure` on trigger).

---

## CMS confirmations

| Item                                         | Decision                                                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Endpoint                                     | **`POST /api/ai-article/reset`** — status-shaped **200** body (same as status)                             |
| Not found today                              | Hub **404 fallback** until CMS deploys — expected                                                          |
| In-flight (`pending` / `writing`)            | **409** — reset not allowed                                                                                |
| Locked (limit / age)                         | **403** — same as trigger                                                                                  |
| Failed **first write**                       | Reset → **`waiting`** — user may trigger with `initial`                                                    |
| Failed **regeneration**                      | Reset → stay **`completed`**, **preserve `structuredOutput`**, clear error flags                           |
| `feedback.count` refund                      | **Yes** — refund **one** count on CMS-side **terminal failure**                                            |
| Re-trigger after reset                       | **Unchanged** — `initial` only without prior success; regen uses **persisted** editorial / source evidence |
| Alternative `retry_after_failure` on trigger | **Not preferred** — use dedicated reset                                                                    |

---

## Hub alignment (post-ack)

| CMS behaviour                    | Hub action                                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| Reset **200**                    | Apply `status`, `locked`, `feedback` from body; then trigger with mapped `requestReason` |
| Reset **404** (pre-deploy)       | Clear local failed state + trigger only (existing fallback)                              |
| Reset **409**                    | Show in-flight message; do not trigger                                                   |
| Reset **403**                    | Show locked message; disable retry                                                       |
| Failed regen reset → `completed` | Restore **`completed`** on trigger error (not `failed` / `idle`)                         |
| Count refund in reset body       | Sync via `updateFeedback()` from reset response                                          |

---

## Joint QA (when CMS reset ships)

| #   | Scenario                              | Expected                                                                                   |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1   | Failed first write → Retry            | Reset **200** → `waiting`; trigger without `requestReason`; `feedback.count` refunded by 1 |
| 2   | Failed regen (context saved) → Retry  | Reset **200** → `completed` + output preserved; trigger `editorial_feedback`               |
| 3   | Failed regen (fixtures saved) → Retry | Reset **200** → `completed`; trigger `source_changed`                                      |
| 4   | Reset while `pending` / `writing`     | **409**; Hub shows in-flight message                                                       |
| 5   | Reset on locked article               | **403**; retry disabled                                                                    |
| 6   | Reset **404** (CMS not deployed)      | Hub fallback only — expect regen retry pain until CMS ships                                |

**Update:** CMS shipped TKT-PBX-012 — run checklist in [CMS handoff](./2026-09-02-cms-handoff-pressbox-failed-reset-hub.md). Hub retired 404 fallback.

---

## Slack version

> **CMS ack — Pressbox reset/retry**  
> Confirmed: we’ll add `POST /api/ai-article/reset` (200 status-shaped, 409 in-flight, 403 locked). Failed first-write → waiting; failed regen → completed + preserve output. Refund one `feedback.count` on terminal failure. Re-trigger rules unchanged. Dedicated reset, not `retry_after_failure`. Hub already calls reset + 404 fallback — ready for joint QA when CMS ships.
