# CMS Handoff — Pressbox plain regen local QA (Hub)

**Date:** 2026-09-09  
**From:** Fixtura CMS Backend  
**To:** Content Hub (Pressbox / Articles panel)  
**Status:** TKT-PBX-013 shipped locally — joint QA on CMS + Hub against local CMS  
**Related:** [CMS ack](./2026-09-09-cms-ack-pressbox-user-requested-regeneration.md) · [Hub request](./2026-09-09-content-hub-pressbox-user-requested-regeneration.md)

---

## Summary

CMS now accepts **`requestReason: "user_requested_regeneration"`** on `POST /api/ai-article/trigger` for Pressbox-routed articles after at least one successful generation. Hub has already shipped UI + reason resolution; this handoff is for **local end-to-end QA** before staging.

**Critical:** CMS trigger can return **200** while the Bull job or Pressbox worker still rejects the new enum if the worker repo is not on Q9. Confirm Pressbox worker locally before treating “queued” as success.

---

## Prerequisites

### CMS (Backend repo)

1. Pull commit with **TKT-PBX-013** (message: `Accept Pressbox plain regeneration via user_requested_regeneration.`).
2. Install deps and start Strapi:

   ```bash
   npm run dev
   ```

3. Set in `.env` (restart after change):

   ```env
   PRESSBOX_ENABLED=true
   AI_ARTICLE_TRIGGER_DEV_AUTH_BYPASS=true
   REDISCLOUD_URL=<local redis>
   ```

   - `PRESSBOX_ENABLED=true` — routes eligible Cricket compositions to Pressbox (not Journalist).
   - `AI_ARTICLE_TRIGGER_DEV_AUTH_BYPASS=true` — **local only**; allows trigger without JWT when testing from Hub against `localhost`. Production must use users-permissions JWT.
   - Redis required for enqueue after trigger **200**.

4. Optional CMS sanity check:

   ```bash
   npm run test:pressbox
   ```

   Expected: **158** tests pass (includes plain regen integration test).

### Content Hub

- Hub build with plain “Request a Review” enabled (no context/fixture gate).
- Hub API base URL pointed at **local CMS** (e.g. `http://localhost:1337`).
- Use a **Pressbox-eligible** article type (e.g. CricketResults, CricketLadder, Top 5, Upcoming, Team of the Week) with **`PRESSBOX_ENABLED=true`** on CMS.

### Pressbox worker (Q9)

Before full E2E, confirm local Pressbox worker job schema allows:

```json
"requestReason": "user_requested_regeneration"
```

on Bull payload v1. If worker Zod is strict, update worker in the same local session as CMS. Otherwise: CMS **200** → job stuck / worker reject.

---

## What Hub sends (unchanged from your spec)

| Scenario                                   | `requestReason`                   |
| ------------------------------------------ | --------------------------------- |
| First write                                | omitted → CMS `"initial"`         |
| Plain “Request a Review”                   | **`user_requested_regeneration`** |
| Persisted editorial context                | `editorial_feedback`              |
| Fixtures saved this session (Weekend Wrap) | `source_changed`                  |

Example plain regen body:

```json
{
  "articleId": 12345,
  "accountId": 705,
  "renderId": 456,
  "requestReason": "user_requested_regeneration"
}
```

Legacy `accountId` / `renderId` optional (cross-check only); **`articleId` required**.

---

## Local QA matrix

Run against one Pressbox-eligible article with a **completed writeup**, not locked, attempts remaining, render within 7 days.

| #     | Steps                                                                           | Expected                                                                                                                       |
| ----- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **1** | Completed writeup, **no** saved context, **no** fixture save → Request a Review | Hub sends `user_requested_regeneration` → CMS **200**, `status: "pending"`, `feedback.count` +1, `generationRequestId` present |
| **2** | Same article with saved context (no edit) → Request a Review                    | Hub sends `editorial_feedback` → CMS **200** (unchanged path)                                                                  |
| **3** | Weekend Wrap: save fixtures → Request a Review                                  | Hub sends `source_changed` → CMS **200** if digest changed                                                                     |
| **4** | At feedback limit or locked                                                     | Hub disabled or CMS **403**                                                                                                    |
| **5** | Failed regen → Reset → Request a Review (no new edits)                          | Reset **200** → trigger `user_requested_regeneration` → **200**                                                                |
| **6** | First write (no prior success)                                                  | No `requestReason` → CMS **200**, `"initial"`                                                                                  |

**Row #1 is the release gate** for TKT-PBX-013.

---

## Success signals (row #1)

### Hub UI

- “Request a Review” enabled on completed writeup (not gated on context).
- No wipe of existing writeup on trigger success.
- Processing / pending state after trigger.

### Network — `POST /api/ai-article/trigger`

- **200** (not 400).
- Response shape (same as other regens):

  ```json
  {
    "data": {
      "status": "pending",
      "locked": false,
      "feedback": {
        "count": 2,
        "limit": 5,
        "remaining": 3,
        "canProvideFeedback": true
      },
      "generationRequestId": "<uuid>",
      "route": "pressbox",
      "timestamps": { ... }
    }
  }
  ```

### CMS / Redis (optional verify)

```bash
node scripts/inspect-pressbox-queue-job.js <generationRequestId>
```

Job payload should include `"requestReason": "user_requested_regeneration"`.

---

## Failure modes (don’t misdiagnose)

| Symptom                                                    | Likely cause                                                                                                           |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **400** `requestReason is required and must be controlled` | CMS not on TKT-PBX-013 build, or typo in reason string                                                                 |
| **200** but no Redis job / worker never starts             | Redis down, `REDISCLOUD_URL` missing, enqueue error → check CMS logs                                                   |
| **200** but worker fails immediately                       | **Q9** — worker enum does not allow `user_requested_regeneration`                                                      |
| **403** locked / limit                                     | Expected — not a plain-regen defect                                                                                    |
| Hub sends `editorial_feedback` when you expected plain     | **Known v1:** persisted context on article (Q4) — clear context or use article without `userFeedbackPrompt` for row #1 |
| Trigger uses Journalist path                               | `PRESSBOX_ENABLED` not `true` or unsupported composition                                                               |

---

## Manual API smoke (without Hub UI)

After first successful generation on article `12345`:

```http
POST http://localhost:1337/api/ai-article/trigger
Content-Type: application/json

{
  "articleId": 12345,
  "requestReason": "user_requested_regeneration"
}
```

With dev auth bypass, omit `Authorization`. With bypass off, send users-permissions JWT as production.

Or:

```bash
node scripts/debug-pressbox-trigger.js 12345
```

(Extend script or use curl if you need to pass `requestReason` — Hub UI is the primary path.)

---

## Known behaviour (v1) — support note

Stale editorial context ⇒ Hub sends **`editorial_feedback`**, not plain regen. For row #1, pick an article with **no** persisted `userFeedbackPrompt`, or clear context before testing.

---

## Out of scope for this handoff

- CMS **staging/production** deploy (blocked on Q9 with Pressbox team for staging).
- Variation prompt / worker branching on reason.
- PostHog or analytics.

---

## When local QA passes

1. Note CMS commit SHA + Hub commit SHA in your QA log.
2. Confirm Pressbox worker Q9 on the same local stack (or document worker commit).
3. Proceed to **CMS staging deploy** only after Pressbox acks worker enum for staging.

---

## Slack version

> **CMS local QA — plain “Request a Review”**  
> TKT-PBX-013 is on Backend: CMS accepts `user_requested_regeneration` on Pressbox trigger. Hub already sends it. For local QA: CMS `PRESSBOX_ENABLED=true`, dev auth bypass, Redis, point Hub at localhost. Run matrix row #1 (completed writeup, no context → **200**). **200 + worker fail = Q9** — update local Pressbox worker enum. Handoff: `src/api/pressbox/.comms/2026-09-09-cms-handoff-pressbox-plain-regen-hub-local-qa.md`
