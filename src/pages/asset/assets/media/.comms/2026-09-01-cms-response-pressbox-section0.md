# CMS response — Pressbox trigger §0 (Hub QA reference)

**Date:** 2026-09-01  
**From:** CMS team (via implementation review)  
**To:** Content Hub  
**Status:** Confirmed by CMS (2026-09-01) — see [cms ack](./2026-09-01-cms-ack-pressbox-rewrite-shipped.md)  
**Related:** [2026-09-01-content-hub-pressbox-rewrite-trigger-contract.md](./2026-09-01-content-hub-pressbox-rewrite-trigger-contract.md) §0

---

## §0 answers

| #     | Question                                                                                     | Answer                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | Is `requestReason` required on every rewrite (Pressbox path, after a successful generation)? | **Yes.** Missing or uncontrolled value → **400** — `requestReason is required and must be controlled`. `"initial"` after success → **400** — `requestReason initial is not valid after a successful generation`.                                                                                                                                                                                                                    |
| **2** | Plain rewrite with no context/fixture change?                                                | **Gate in Hub.** No generic regeneration reason exists today. Hub disables “Request a Review” until persisted context or fixture save (Weekend Wrap).                                                                                                                                                                                                                                                                               |
| **3** | Exact **400** body when `requestReason` missing on completed article?                        | Strapi `badRequest(message)` — Hub reads **`response.data.error.message`**. Expected text: **`requestReason is required and must be controlled`**. No structured `error.code` required for Hub v1.                                                                                                                                                                                                                                  |
| **4** | When is **`requestReasonDetail`** required?                                                  | **Optional in v1.** For `editorial_feedback`, CMS builds the feedback snapshot from persisted **`userFeedbackPrompt`** on the article (`buildFeedbackSnapshotFromArticle`), not from the trigger body. Hub omits `requestReasonDetail`.                                                                                                                                                                                             |
| **5** | Does **`feedback.count`** include the initial generation?                                    | **Yes — every trigger**, including first write. Treat as **generation attempt count**, not “rewrites only”. Hub disables when `count >= limit` (and when `locked` / `!canProvideFeedback`).                                                                                                                                                                                                                                         |
| **6** | Do fixture updates produce a different source digest for `source_changed`?                   | Digest is computed at **trigger time** from persisted **`ArticleDataForPrompt`**. Successful `POST /api/ai-article/fixtures` updates persisted data; digest must **differ** from latest successful generation. **Edge case:** save with identical data → digest unchanged → **400** — `source_changed requires a different source digest from the latest successful generation`. Hub surfaces CMS message; no digest compare in v1. |

---

## Additional confirmations (Hub alignment)

| Topic                     | CMS behaviour                                                          | Hub implementation                                                  |
| ------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Authoritative ID          | **`articleId` only**; `accountId` / `renderId` optional cross-checks   | Sends all three in v1; mismatch → **400**                           |
| Trigger HTTP errors       | Validation/auth (**400/403**); does not mark article generation failed | Restore prior `completed` on rewrite trigger failure                |
| Lifecycle `failed`        | Set by generation pipeline, reflected in status poll                   | Hub sets failed UI **only** when poll returns `status === "failed"` |
| Lock / limit              | **403** — `Service denied: Article with ID … is locked. Reason: …`     | Disable rewrite + tooltip                                           |
| `feedback.limit` mismatch | ~~Status **5**; trigger **3**~~                                        | ✅ CMS aligned trigger 200 to **5**                                 |

---

## Hub QA table (with §0 expectations)

| #      | Scenario                                        | Request                               | Expected HTTP          | Pass criteria                                                                  |
| ------ | ----------------------------------------------- | ------------------------------------- | ---------------------- | ------------------------------------------------------------------------------ |
| **1**  | First write                                     | No `requestReason`                    | **200**                | `status: "pending"`; count increments to **1**                                 |
| **2**  | Save context → Request a Review                 | `requestReason: "editorial_feedback"` | **200**                | Context persisted before trigger; count increments                             |
| **3**  | Weekend Wrap: save fixtures → Request a Review  | `requestReason: "source_changed"`     | **200**                | Fixtures API succeeded first; digest changed vs last success                   |
| **3b** | Weekend Wrap: save fixtures, **data unchanged** | `requestReason: "source_changed"`     | **400**                | Message contains `different source digest`; writeup still visible              |
| **4**  | Completed article, no context/fixture change    | _(no request — button disabled)_      | —                      | No trigger call; tooltip explains precondition                                 |
| **5**  | Locked or at limit                              | Trigger blocked or **403**            | **403** or disabled UI | No writeup wipe; lock message or tooltip                                       |
| **6**  | Missing `requestReason` on rewrite (manual/API) | Body without `requestReason`          | **400**                | `error.message` === `requestReason is required and must be controlled`         |
| **7**  | `editorial_feedback` without saved context      | `requestReason: "editorial_feedback"` | **400**                | `editorial_feedback requires a bounded feedback snapshot`                      |
| **8**  | Poll after successful rewrite                   | `POST /api/ai-article/status`         | **200**                | `feedback.limit` consistent with status (note trigger/limit bug until CMS fix) |

---

## Controlled `requestReason` values

| Value                  | When valid                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `"initial"`            | First write only (no prior successful generation)                                        |
| `"editorial_feedback"` | Rewrite; `userFeedbackPrompt` must exist on article                                      |
| `"source_changed"`     | Rewrite; prior successful source digest exists and differs from current persisted source |

---

## Open (CMS action only)

- [x] Fix **`buildTriggerResponseData`** limit default — **done** (CMS ack 2026-09-01)

Everything else in §0 is sufficient for Hub manual QA.
