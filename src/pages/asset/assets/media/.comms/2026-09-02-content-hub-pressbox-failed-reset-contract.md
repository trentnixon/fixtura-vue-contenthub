# Pressbox failed generation — reset / retry contract

**Date:** 2026-09-02  
**Status:** CMS shipped (2026-09-02) — joint QA after CMS restart/deploy  
**From:** Content Hub (Pressbox)  
**To:** CMS team  
**Related:** [rewrite trigger contract](./2026-09-01-content-hub-pressbox-rewrite-trigger-contract.md) · [rewrite shipped](./2026-09-01-content-hub-pressbox-rewrite-shipped.md) · [CMS ack](./2026-09-02-cms-ack-pressbox-failed-reset-contract.md) · [CMS handoff](./2026-09-02-cms-handoff-pressbox-failed-reset-hub.md)

---

## Summary

Users can land on a **failed** writeup state (`status === "failed"`) after CMS reports a generation failure, or after Hub loses connectivity while polling. Hub **Retry generation** calls `POST /api/ai-article/reset` then re-triggers with mapped `requestReason`.

**CMS shipped (2026-09-02):** See [CMS handoff](./2026-09-02-cms-handoff-pressbox-failed-reset-hub.md). Hub no longer silently falls back on reset **404**.

---

## User-facing problem

| Symptom                                          | Likely cause                                                                     |
| ------------------------------------------------ | -------------------------------------------------------------------------------- |
| “Network Error” + failed UI                      | Transient poll failure; CMS may still be processing or completed                 |
| Failed UI, **Retry** disabled                    | `locked: true` or feedback limit reached                                         |
| Failed UI, **Retry** enabled but trigger **400** | Reset skipped or CMS rejected re-trigger (check reset **400** / trigger message) |
| Failed after completed writeup                   | Needs reset before regen trigger (Hub calls reset; CMS must ship endpoint)       |

---

## CMS endpoint (confirmed)

```http
POST /api/ai-article/reset
Content-Type: application/json

{
  "accountId": 705,
  "renderId": 456,
  "articleId": 12345
}
```

### Behaviour (CMS ack)

| Current CMS state                         | After reset                                                          |
| ----------------------------------------- | -------------------------------------------------------------------- |
| Failed **first write** (no prior success) | **`waiting`** — trigger with `initial`                               |
| Failed **regeneration**                   | **`completed`** — **preserve `structuredOutput`**, clear error flags |
| `pending` / `writing`                     | **409** — reset not allowed while in flight                          |
| Locked (limit / age)                      | **403** — same as trigger                                            |
| Nothing to reset                          | **400** — e.g. clean `waiting` with no error                         |

### Response (200)

Same shape as `POST /api/ai-article/status`. **`feedback.count`** refunded by **one** on CMS-side terminal failure.

```json
{
  "data": {
    "status": "waiting",
    "locked": false,
    "feedback": {
      "count": 1,
      "limit": 5,
      "remaining": 4,
      "canProvideFeedback": true
    },
    "timestamps": { ... }
  }
}
```

Failed regen reset returns `"status": "completed"` with output intact.

### §0 — resolved (2026-09-02)

| #   | Question                                            | CMS answer                                              |
| --- | --------------------------------------------------- | ------------------------------------------------------- |
| 1   | Refund `feedback.count` on failed attempt?          | **Yes** — one count on terminal failure                 |
| 2   | Re-trigger with `initial` after failed first write? | **Yes** — after reset → `waiting`                       |
| 3   | Re-trigger regen without new edits after reset?     | **Yes** — use **persisted** editorial / source evidence |
| 4   | Reset endpoint vs `retry_after_failure`?            | **Dedicated reset** — not trigger reason                |

---

## Hub behaviour (shipped)

| Step                             | Action                                                                             |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| User clicks **Retry generation** | Confirmation → retry flow                                                          |
| `status === "failed"`            | `POST /api/ai-article/reset`; sync `feedback` from body                            |
| Reset **404**                    | Surface error — CMS reset not available (upgrade/restart CMS)                      |
| Reset **400**                    | Surface CMS message — nothing to reset                                             |
| Reset **409**                    | Show in-flight message; abort                                                      |
| Reset **403**                    | Show locked message                                                                |
| Reset success                    | Refetch writeup when `status === completed`; then trigger                          |
| Trigger error after reset        | Restore status from reset response (`waiting` or `completed`)                      |
| Poll timeout                     | **Still working** UI with Check for update / Keep waiting (not raw timeout string) |

### Trigger mapping on failed retry (unchanged)

| Condition                                  | `requestReason`           |
| ------------------------------------------ | ------------------------- |
| Saved context                              | `editorial_feedback`      |
| Fixtures saved this session (Weekend Wrap) | `source_changed`          |
| Otherwise (first-write failure)            | omitted → CMS `"initial"` |

---

## Hub code references

- Reset service: `src/store/aiArticles/service.ts` → `POST /ai-article/reset`
- Reset action: `src/store/aiArticles/actions.ts` → `resetArticleGenerationAction`
- Retry flow: `src/composables/aiArticles/useArticleTriggerFlow.ts`
- Failed UI: `src/pages/asset/assets/media/articleTypes/_components/WriteupFailedState.vue`
- Timeout UI: `src/pages/asset/assets/media/articleTypes/_components/WriteupGeneratingState.vue`
- Resilient polling: `src/composables/aiArticles/useArticlePolling.ts`

---

## Slack version

> **Pressbox failed writeup — reset/retry (CMS shipped)**  
> CMS live: `POST /api/ai-article/reset`. Hub calls reset → sync feedback → trigger. Joint QA: [CMS handoff](./2026-09-02-cms-handoff-pressbox-failed-reset-hub.md).
