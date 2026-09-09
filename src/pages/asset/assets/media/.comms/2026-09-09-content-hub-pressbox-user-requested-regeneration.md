# Pressbox plain regeneration — `user_requested_regeneration` request

**Date:** 2026-09-09  
**From:** Content Hub (Pressbox)  
**To:** CMS team  
**Status:** Hub shipped — CMS **TKT-PBX-013** in progress; Round 1 decisions locked (see [CMS ack](./2026-09-09-cms-ack-pressbox-user-requested-regeneration.md))  
**Related:** [CMS ack](./2026-09-09-cms-ack-pressbox-user-requested-regeneration.md) · [rewrite trigger contract](./2026-09-01-content-hub-pressbox-rewrite-trigger-contract.md) · [§0 response](./2026-09-01-cms-response-pressbox-section0.md) · [rewrite shipped](./2026-09-01-content-hub-pressbox-rewrite-shipped.md) · [failed reset contract](./2026-09-02-content-hub-pressbox-failed-reset-contract.md)

---

## Summary

Pressbox **“Request a Review”** is not only for editorial context or fixture edits. Users also need to regenerate when they **dislike the AI output** and want another version — with no data or context changes.

In §0 (2026-09-01), CMS asked Hub to **gate** plain rewrites because no generic regeneration reason existed. That made the button disabled after the first successful write, which is **not** the intended product behaviour.

Content Hub is shipping support for a new controlled reason: **`user_requested_regeneration`**. We need CMS to accept it on the Pressbox trigger path so users can request a review at any time (subject to existing lock / attempt limits).

---

## Product intent

| User goal | Expected UX | `requestReason` (Hub sends) |
| --------- | ----------- | ----------------------------- |
| First writeup | Send to Press Box | omitted → CMS `"initial"` |
| Don’t like output — try again | Request a Review (always available when not locked) | **`user_requested_regeneration`** |
| Added editorial context | Request a Review | `editorial_feedback` |
| Saved fixture changes (Weekend Wrap) | Request a Review | `source_changed` |

**Priority when multiple apply** (Hub resolves one reason per trigger):

1. `source_changed` — fixtures saved this session (Weekend Wrap)
2. `editorial_feedback` — persisted context exists
3. `user_requested_regeneration` — default for any other regeneration

Plain regeneration must **not** require `userFeedbackPrompt` or a changed source digest.

---

## CMS request

### 1. Add controlled `requestReason` value

| Value | When valid | Preconditions |
| ----- | ---------- | ------------- |
| `"user_requested_regeneration"` | Any Pressbox regeneration after a prior successful generation | Same as today: not locked, under `feedback.limit`, within eligibility window. **No** context or digest change required. |

### 2. Behaviour

- Accept on `POST /api/ai-article/trigger` for Pressbox-routed articles after at least one successful generation.
- Enqueue a new generation using **current persisted source** (`ArticleDataForPrompt` / structured inputs as today).
- Optionally incorporate persisted `userFeedbackPrompt` if present (same as other regen paths) — but **must not require** it.
- Increment `feedback.count` like other triggers.
- Return same **200** shape as existing regen triggers (`status: "pending"`, `generationRequestId`, `feedback`, etc.).

### 3. Reject cases (unchanged)

| Condition | Status | Notes |
| --------- | ------ | ----- |
| Missing / invalid `requestReason` on rewrite | **400** | Unchanged |
| `"initial"` after successful generation | **400** | Unchanged |
| Locked / at limit / outside window | **403** | Unchanged |
| `"editorial_feedback"` without snapshot | **400** | Unchanged — Hub only sends this when context API succeeded |
| `"source_changed"` without digest change | **400** | Unchanged — Hub only sends after fixture save API |

### 4. Failed reset + retry

After `POST /api/ai-article/reset` on a **failed regeneration** (prior `structuredOutput` preserved, status restored to `completed`):

| Hub condition | `requestReason` |
| ------------- | --------------- |
| Fixtures saved this session | `source_changed` |
| Persisted context | `editorial_feedback` |
| Otherwise | **`user_requested_regeneration`** |

Hub will **no longer** send omitted/`initial` for failed regen retry when a completed writeup exists.

---

## Trigger payload examples

```json
// Plain "Request a Review" — no context, no fixture change
{
  "articleId": 12345,
  "accountId": 705,
  "renderId": 456,
  "requestReason": "user_requested_regeneration"
}
```

```json
// After editorial context saved (unchanged)
{
  "articleId": 12345,
  "requestReason": "editorial_feedback"
}
```

```json
// After fixture save — Weekend Wrap (unchanged)
{
  "articleId": 12345,
  "requestReason": "source_changed"
}
```

Optional `requestReasonDetail` remains **omitted** in Hub v1 for all reasons.

---

## Hub changes (shipped with this comms)

| Area | Change |
| ---- | ------ |
| UI gating | **Removed** precondition gate on “Request a Review” — enabled whenever writeup exists, not locked, not in progress |
| `pressboxTrigger.ts` | Default regen reason → `user_requested_regeneration`; `canRequestRegeneration` only checks lock + pending |
| Tooltips | Removed “add context to request a review” disable tooltips; lock / in-progress tooltips unchanged |
| Confirmation copy | Regeneration modal explains user can request another version (attempt limits still apply) |
| Failed retry | Fallback regen reason → `user_requested_regeneration` when not first-write failure |

**Until CMS ships:** plain “Request a Review” will return **400** if CMS does not recognise `user_requested_regeneration`. Hub surfaces CMS `error.message`; existing writeup remains visible.

---

## QA matrix (joint)

| # | Scenario | Request | Expected |
| - | -------- | ------- | -------- |
| 1 | Completed writeup, no context/fixture change | `user_requested_regeneration` | **200**, new generation queued |
| 2 | Completed writeup, context saved | `editorial_feedback` | **200** (unchanged) |
| 3 | Weekend Wrap, fixtures saved | `source_changed` | **200** (unchanged) |
| 4 | Locked / at limit | any regen reason | **403** or disabled UI |
| 5 | Unknown `requestReason` | e.g. typo | **400** — controlled value message |
| 6 | Failed regen → reset → retry, no new edits | `user_requested_regeneration` | Reset **200** → trigger **200** |
| 7 | First write (no prior success) | no `requestReason` | **200** → `"initial"` (unchanged) |

---

## Round 1 — decisions (locked 2026-09-09)

Full CMS ack: [2026-09-09-cms-ack-pressbox-user-requested-regeneration.md](./2026-09-09-cms-ack-pressbox-user-requested-regeneration.md)

| # | Question | Decision |
| - | -------- | -------- |
| Q1 | Name | **`user_requested_regeneration`** — locked |
| Q2 | Evidence model | **A** — CMS evidence-free; enum + lock/limit/window only |
| Q3 | Persisted context on plain regen | **A (v1)** — may still apply in worker snapshot; not required |
| Q4 | Old context ⇒ `editorial_feedback`? | **Accept Hub priority** for v1 |
| Q5 | Worker prompt | **Same path** — variation out of scope |
| Q6 | Rate limit | **Same `feedback.limit` (5)** |
| Q7 | CMS ship scope | Enum + tests + §4 docs + TKT-PBX-013 + ack |
| Q8 | Pre-deploy 400 | Expected until CMS deploy; Hub shows `error.message` |

**Deploy order:** CMS **TKT-PBX-013** to **staging** before joint QA row #1. Hub may ship first; **400 until CMS live is expected** (Round 2 Q10).

---

## Round 2 — implementation (locked 2026-09-09)

Canonical CMS ack: `src/api/pressbox/.comms/2026-09-09-cms-ack-pressbox-user-requested-regeneration.md`  
Hub mirror: [2026-09-09-cms-ack-pressbox-user-requested-regeneration.md](./2026-09-09-cms-ack-pressbox-user-requested-regeneration.md)

| # | Question | Decision |
| - | -------- | -------- |
| Q9 | Worker job schema | Confirm Pressbox worker enum before CMS deploy; extend queue + Zod or get written pass-through confirmation |
| Q10 | Deploy / QA sequencing | CMS staging first → Hub row #1; pre-deploy Hub **400** is not a bug |
| Q11 | CMS ack location | Canonical in `src/api/pressbox/.comms/` (TKT-PBX-011/012 pattern) |
| Q12 | Schema migration | `npm run test:pressbox` + Strapi sync in TKT-PBX-013; no separate migration ticket unless staging drift |
| Q13 | Stale-context support note | Paragraph in CMS ack **Known behaviour (v1)** — not Hub `CONTEXT.md` |

---

## Hub code references

- Reason resolution & gating: `src/composables/aiArticles/pressboxTrigger.ts`
- Trigger flow: `src/composables/aiArticles/useArticleTriggerFlow.ts`
- Payload types: `src/store/aiArticles/service.ts`
- UI copy: `src/constants/pressboxCopy.ts`
- Article orchestrators: `src/pages/asset/assets/media/articleTypes/*.vue`

---

## Slack version

> **Pressbox — plain “Request a Review”**  
> Users need to regenerate when they don’t like the output, not only after context/fixture changes. Hub is removing the UI gate and sending `requestReason: "user_requested_regeneration"` for default rewrites. CMS §0 asked us to gate plain rewrites — that was a workaround. Can CMS add `user_requested_regeneration` on the Pressbox trigger path (no context/digest required; same lock/limit rules)? Hub ships now; plain retry 400s until CMS accepts the new reason. QA matrix in `.comms/2026-09-09-content-hub-pressbox-user-requested-regeneration.md`.
