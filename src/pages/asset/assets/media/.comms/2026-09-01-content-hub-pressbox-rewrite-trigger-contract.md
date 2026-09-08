# Pressbox AI Article Rewrites — Content Hub → CMS Trigger Contract

**Date:** 2026-09-01  
**From:** Content Hub (Pressbox / Articles panel)  
**To:** CMS team  
**Related:** `CMS_IMPLEMENTATION_DECISIONS_2026-08-18.md` §4 (controlled `requestReason`)

---

## Summary

Content Hub **Pressbox** (the Articles panel on asset pages) uses `POST /api/ai-article/trigger` for both **first-time generation** and **rewrites** (“Request a Review”). First write works; **rewrites return HTTP 400 in ~12ms**.

After reviewing the CMS Pressbox trigger implementation, we believe the failure is **not** a blocked rewrite path — rewrites are supported — but a **missing Pressbox contract field**: **`requestReason`** on regeneration requests. Content Hub still sends the legacy payload `{ accountId, renderId, articleId }` only.

We need CMS to confirm the regeneration contract per scenario (context, fixture edit, plain rewrite) so we can align Pressbox and unblock rewrites.

---

## What Pressbox does

Pressbox lives on asset routes, e.g.:

`/{accountId}/{sport}/{renderId}/{groupingCategory}/{asset}`

**Pressbox-eligible types:** `CricketResults`, `CricketLadder`, Top 5 / Performances / Team of the Week, `CricketUpcoming`.

**Flow (both first write and rewrite):**

1. User confirms → `POST /api/ai-article/trigger`
2. Poll `POST /api/ai-article/status` (5s interval)
3. On `completed`, render from `structuredOutput`; copy to clipboard

**Rewrite-specific UI (“Request a Review”):**

- Shown when an article already exists
- Optional **context** via `POST /api/ai-article/context` (max 1000 chars)
- **Weekend Wrap only:** fixture edits via `POST /api/ai-article/fixtures` before regenerate

There is no manual body editor — rewrites are always AI-regenerated via trigger.

---

## Symptom

| Observation                  | Detail                                                                                                                      |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| First write                  | Works                                                                                                                       |
| Rewrite (“Request a Review”) | **400** in ~12ms                                                                                                            |
| Content Hub error shown      | `Request failed with status code 400` + generic “Article generation failed”                                                 |
| CMS log (local)              | `AI_ARTICLE_TRIGGER_DEV_AUTH_BYPASS active — using account 705 owner user 204` → `POST /api/ai-article/trigger (12 ms) 400` |

The ~12ms response time indicates **synchronous validation**, not queue/AI work.

---

## Likely root cause

With `PRESSBOX_ENABLED=true`, Pressbox-eligible articles use `runPressboxTriggerPath` → `resolveTriggerRequestReason`.

| Scenario                                         | `requestReason`                           |
| ------------------------------------------------ | ----------------------------------------- |
| **First write** (no prior successful generation) | Optional; defaults to `"initial"`         |
| **Rewrite** (prior successful generation exists) | **Required** — must be a controlled value |

CMS rejects rewrites without a valid `requestReason`:

- Missing / invalid → **400** — `"requestReason is required and must be controlled"`
- `"initial"` after a successful generation → **400** — `"requestReason initial is not valid after a successful generation"`

**Allowed values:**

- `"initial"` — first write only
- `"source_changed"` — regeneration after source data changed
- `"editorial_feedback"` — regeneration after editorial/context feedback

Content Hub currently sends **only**:

```json
{ "accountId": number, "renderId": number, "articleId": number }
```

No `requestReason` → expected **400** on completed articles. Documented in **CMS_IMPLEMENTATION_DECISIONS_2026-08-18.md §4**: _“Frontend sends controlled `requestReason`.”_

### Mapping Pressbox UI → `requestReason`

| Pressbox scenario                                       | Send                      | CMS preconditions (will 400 if unmet)                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User saved context, wants editorial rewrite             | `"editorial_feedback"`    | **`userFeedbackPrompt` must exist** (via `POST /api/ai-article/context`). Without saved context: `"editorial_feedback requires a bounded feedback snapshot"`                                                                                                                                                                                  |
| User edited fixtures (Weekend Wrap) before regenerate   | `"source_changed"`        | Prior successful **source digest** must exist; digest must **differ** from latest successful generation. Failures: `"source_changed requires a prior successful source digest"` / `"source_changed requires a different source digest from the latest successful generation"`. Please confirm fixture updates bump the digest before rewrite. |
| Plain “Request a Review” with no context/fixture change | **No valid reason today** | CMS has no generic regeneration reason. Pressbox should gate this button or CMS should add one (e.g. `user_requested_regeneration`).                                                                                                                                                                                                          |

**Important:** There is **no valid rewrite path today** without either saved context or a source digest change.

**Journalist path note:** With `PRESSBOX_ENABLED=false`, rewrites use `enqueueJournalistGeneration` and do **not** require `requestReason`. If first write works but rewrite fails only with Pressbox enabled, that further confirms this diagnosis.

---

## §0 Immediate unblock — questions for CMS

1. Is `requestReason` **required on every rewrite** for Pressbox-routed articles? (We believe yes.)
2. **Plain rewrite** with no context/fixture change — should we add a new reason, or gate “Request a Review” until context/fixtures are changed?
3. What is the **exact 400 body** when `requestReason` is missing on a completed article?
4. When is **`requestReasonDetail`** (max 500 chars) required vs optional?
5. Does **`feedback.count`** include the initial generation, or only regenerations? (CMS increments on every trigger including first write; Pressbox disable logic may be off by one if we treat count as “rewrites only”.)
6. Please confirm fixture updates via `POST /api/ai-article/fixtures` reliably produce a **different source digest** before `"source_changed"` rewrite is allowed.

---

## Trigger payload contract

CMS treats **`articleId` as authoritative**. `accountId` / `renderId` are optional legacy cross-checks.

```json
// First write — requestReason optional; defaults to "initial"
{ "articleId": 12345 }

// Rewrite after context saved (context API must have run first)
{
  "articleId": 12345,
  "requestReason": "editorial_feedback"
}

// Rewrite after fixture edit (Weekend Wrap; digest must have changed)
{
  "articleId": 12345,
  "requestReason": "source_changed"
}
```

Optional: `requestReasonDetail` (max 500 chars).

Legacy cross-check (during transition):

```json
{
  "articleId": 12345,
  "accountId": 705,
  "renderId": 456,
  "requestReason": "editorial_feedback"
}
```

Mismatch on optional `accountId` → **400** — `"Service denied: accountId does not match the derived article account"`.

---

## Dev bypass & production auth

**Local dev:** `AI_ARTICLE_TRIGGER_DEV_AUTH_BYPASS=true` resolves auth from the **article-derived account** (log: `using account 705 owner user 204`), not a hardcoded override or URL segment.

**Production:** Trigger requires **users-permissions JWT**. Dev bypass is non-production only.

---

## HTTP status codes — 400 vs 403

| Condition                                     | Status  | Example message                                                                          |
| --------------------------------------------- | ------- | ---------------------------------------------------------------------------------------- |
| Missing/invalid `requestReason` on rewrite    | **400** | `requestReason is required and must be controlled`                                       |
| `"initial"` after successful generation       | **400** | `requestReason initial is not valid after a successful generation`                       |
| `"editorial_feedback"` without saved context  | **400** | `editorial_feedback requires a bounded feedback snapshot`                                |
| `"source_changed"` without / unchanged digest | **400** | `source_changed requires a prior successful source digest` / `…different source digest…` |
| `accountId` cross-check mismatch              | **400** | `Service denied: accountId does not match the derived article account`                   |
| Feedback limit / article age lock             | **403** | `Service denied: Article with ID … is locked. Reason: …`                                 |
| Enqueue failure                               | **503** | `details.code: PRESSBOX_ENQUEUE_FAILED`                                                  |

**Eligibility window:** **14 days** (despite `isRenderWithin7Days` naming).

---

## Error response shape

Trigger **400**s use Strapi `ctx.badRequest(message)` — typically plain `error.message`. Please confirm whether structured `error.code` (e.g. `INVALID_REQUEST_REASON`) surfaces in the HTTP body.

Content Hub will parse `response.data.error.message`.

---

## Worked example (requested from CMS)

```http
POST /api/ai-article/trigger
Content-Type: application/json

{ "articleId": 27321, "requestReason": "editorial_feedback" }
```

**Prerequisite:** Context saved via `POST /api/ai-article/context` for this article.

**Expected 200:**

```json
{
  "data": {
    "status": "pending",
    "route": "pressbox",
    "generationRequestId": "<uuid>",
    "feedback": {
      "count": 2,
      "limit": 5,
      "remaining": 3,
      "canProvideFeedback": true
    }
  }
}
```

Note: Trigger exposes **legacy `articleStatus`** — internal `queued` maps to **`"pending"`** in the response (not `"queued"`). `generationRequestId` is returned on the Pressbox path and is useful for debugging. Example `feedback` values assume this is a **second trigger** after a completed first generation (CMS increments count on every trigger); confirm semantics via §0 Q5.

Please confirm equivalent for `"source_changed"` after fixture update.

---

## Status endpoint

```json
{
  "status": "waiting" | "pending" | "writing" | "completed" | "failed" | null,
  "locked": boolean,
  "feedback": {
    "count": number,
    "limit": number,
    "remaining": number,
    "canProvideFeedback": boolean
  },
  "timestamps": { ... }
}
```

**Flag for CMS:** Status endpoint defaults feedback **limit to 5**; trigger success response builder defaults to **3** in one code path. Please align so Pressbox doesn’t disable “Request a Review” at the wrong count.

---

## What Content Hub will implement (once contract confirmed)

1. Include **`requestReason`** on rewrite triggers for Pressbox-eligible articles.
2. Map UI flows:
   - Context saved → `"editorial_feedback"` (only if context API succeeded)
   - Fixtures edited → `"source_changed"` (only if digest change confirmed)
   - Plain “Request a Review” → per CMS answer in §0 (likely **gate the button** until preconditions met)
3. Parse **`error.message`** from CMS on trigger failure.
4. Respect **`locked`** / **`canProvideFeedback`** from status before showing rewrite.
5. Optionally slim trigger body to `{ articleId, requestReason }`; keep cross-check IDs during transition.

---

## Content Hub references

- Trigger: `src/store/aiArticles/service.ts` → `POST /ai-article/trigger`
- Orchestrators: `src/pages/asset/assets/media/articleTypes/*.vue`
- Shell: `src/pages/asset/assets/media/AssetDisplayArticle.vue`

---

## Slack version

> **Pressbox rewrites → CMS trigger contract**  
> Pressbox “Request a Review” hits `POST /api/ai-article/trigger` with `{ accountId, renderId, articleId }` only. First write works; rewrites return **400 ~12ms**. CMS Pressbox path requires **`requestReason`** on regenerations (`editorial_feedback` or `source_changed` per `CMS_IMPLEMENTATION_DECISIONS_2026-08-18.md` §4). We suspect missing `requestReason` → `"requestReason is required and must be controlled"`. Plain rewrite may have no valid reason without context/fixture change. Can CMS confirm rewrite payload per scenario, document 400/403 cases, align feedback limit defaults (3 vs 5), clarify whether `feedback.count` includes initial generation, and share the error body for our failing call? We’ll add `requestReason` + surface `error.message` on our side.
