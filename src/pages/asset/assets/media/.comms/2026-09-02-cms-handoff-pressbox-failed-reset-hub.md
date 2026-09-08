# CMS Handoff — Pressbox Failed Generation Reset (Hub)

**Date:** 2026-09-02  
**From:** Fixtura CMS Backend  
**To:** Content Hub (Pressbox / Articles panel)  
**Status:** Shipped — ready for joint QA after CMS restart/deploy

---

## What shipped

CMS implements **`POST /api/ai-article/reset`** per the contract you acked on 2026-09-02.

Your **Retry generation** flow can now:

1. Call reset when writeup is in a failed terminal state
2. Sync refunded `feedback.count` from the 200 response
3. Call trigger with your existing `requestReason` mapping

**Remove or demote 404 fallback** once CMS with this change is running in your target environment.

---

## Endpoint

```http
POST /api/ai-article/reset
Authorization: Bearer <JWT>
Content-Type: application/json

{ "accountId": number, "renderId": number, "articleId": number }
```

Only **`articleId` is required** for auth derivation; legacy IDs are cross-checked when sent.

---

## Behaviour you should expect

| Case                           | Reset 200 `data.status`  | Notes                                                         |
| ------------------------------ | ------------------------ | ------------------------------------------------------------- |
| Failed first write             | `waiting`                | `feedback.count` decremented by 1                             |
| Failed regen                   | `completed`              | `structuredOutput` unchanged; error flags cleared server-side |
| `enqueue_failed` (503 trigger) | `waiting` or `completed` | Same refund rules                                             |
| In-flight                      | **409**                  | Message contains “still generating”                           |
| Locked / at limit              | **403**                  | Same strings as trigger                                       |
| Nothing to reset               | **400**                  | e.g. clean `waiting` with no error                            |

Response **`data`** matches **`POST /api/ai-article/status`** / trigger 200:

```json
{
  "data": {
    "status": "waiting",
    "locked": false,
    "feedback": {
      "count": 0,
      "limit": 5,
      "remaining": 5,
      "canProvideFeedback": true
    },
    "timestamps": { "createdAt": "...", "updatedAt": "..." }
  }
}
```

---

## Your post-ack tweaks — confirmed compatible

| Hub change                              | CMS fit                                            |
| --------------------------------------- | -------------------------------------------------- |
| Reset 200 → `updateFeedback()`          | Yes — use `data.feedback` from reset response      |
| Error restore → `waiting` / `completed` | Yes — matches reset outcomes                       |
| 409 → “still generating…”               | Yes — CMS returns structured 409 with that wording |
| reset → trigger sequence                | Yes — re-trigger rules unchanged                   |

---

## Re-trigger after reset (unchanged)

| Condition                      | `requestReason`      |
| ------------------------------ | -------------------- |
| Saved editorial context        | `editorial_feedback` |
| Fixtures saved (Weekend Wrap)  | `source_changed`     |
| First write (no prior success) | omit → `initial`     |

Plain regen without context/fixture changes remains **gated in Hub UI** — CMS still has no generic rewrite reason.

---

## Joint QA checklist

Run after **CMS restart** with this branch/deploy:

- [ ] **1.** Force first-write failure → Retry → reset 200 `waiting`, count refunded → trigger 200 → completes
- [ ] **2.** Completed writeup → regen fails → Retry → reset 200 `completed`, prior copy visible → trigger with context/fixture reason → 200
- [ ] **3.** Trigger while `writing` → reset **409**, Hub shows in-flight message
- [ ] **4.** Article at feedback limit → reset **403**
- [ ] **5.** `enqueue_failed` (kill Redis / queue) → reset refunds → retry trigger succeeds
- [ ] **6.** Confirm reset **404** gone (was pre-ship fallback)

Capture **`articleId`** + any **`generationRequestId`** for CMS traces.

---

## CMS files (for reference)

- `src/api/pressbox/controllers/services/resetGeneration.js`
- `src/api/ai-article/controllers/handler/ai-article-reset.js`
- `src/api/pressbox/.comms/2026-09-02-cms-ack-pressbox-failed-reset-contract.md`
- Ticket: **TKT-PBX-012**

---

## Hub references

- Contract: [2026-09-02-content-hub-pressbox-failed-reset-contract.md](./2026-09-02-content-hub-pressbox-failed-reset-contract.md)
- CMS ack: [2026-09-02-cms-ack-pressbox-failed-reset-contract.md](./2026-09-02-cms-ack-pressbox-failed-reset-contract.md)
- Reset service: `src/store/aiArticles/service.ts`
- Reset action: `src/store/aiArticles/actions.ts` → `resetArticleGenerationAction`
- Retry flow: `src/composables/aiArticles/useArticleTriggerFlow.ts`

---

## Slack handoff

> **CMS shipped Pressbox reset** — `POST /api/ai-article/reset` is in CMS backend (TKT-PBX-012). Failed first-write → waiting + count refund; failed regen → completed + output kept; in-flight 409; locked 403. Response = status shape. Restart CMS and run your retry QA — 404 fallback should be retired once deployed. Handoff: `.comms/2026-09-02-cms-handoff-pressbox-failed-reset-hub.md`
