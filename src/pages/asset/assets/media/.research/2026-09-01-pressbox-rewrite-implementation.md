# Pressbox Rewrite — Content Hub Implementation Plan

**Date:** 2026-09-01  
**Status:** Ready to implement (Round 1 decisions locked; CMS §0 nice-to-have only)  
**Symptom:** “Request a Review” → `POST /ai-article/trigger` → 400 in ~12ms

---

## Round 1 decisions (2026-09-01)

| #   | Decision                                                                                                  |
| --- | --------------------------------------------------------------------------------------------------------- |
| Q1  | **C** — Phase A + `requestReason` + conservative gating now (don’t wait for CMS §0)                       |
| Q2  | **A** — Disable rewrite until preconditions met; no plain rewrite                                         |
| Q3  | **A** — Persisted context (`hasContext` on mount) → `editorial_feedback`                                  |
| Q4  | **A** — Fixtures changed → `source_changed`; context-only → `editorial_feedback`; both → `source_changed` |
| Q5  | **A** — All four orchestrators in one PR                                                                  |
| Q6  | **C** — Keep “Request a Review”; no “feedback” in user copy                                               |
| Q7  | **C** — Disable on CMS `locked` / `!canProvideFeedback` **and** `count >= limit`                          |
| Q8  | **C** — Glossary in root `CONTEXT.md` (done)                                                              |

### Gating matrix

| Type                     | Enable “Request a Review” when…                              | `requestReason`                         |
| ------------------------ | ------------------------------------------------------------ | --------------------------------------- |
| Top5 / Ladder / Upcoming | Persisted editorial context exists                           | `editorial_feedback`                    |
| Weekend Wrap             | Context saved **or** fixtures saved (API) since last success | `editorial_feedback` / `source_changed` |
| Any                      | Not locked, `canProvideFeedback`, count < limit              | —                                       |

---

## Root cause (confirmed against CMS code)

Pressbox regenerations require **`requestReason`**. Content Hub sends `{ accountId, renderId, articleId }` only.

| Rewrite scenario           | `requestReason`        | CMS precondition                            |
| -------------------------- | ---------------------- | ------------------------------------------- |
| First write                | optional → `"initial"` | —                                           |
| After context saved        | `"editorial_feedback"` | Context must exist via context API          |
| After fixture edit         | `"source_changed"`     | Source digest must differ from last success |
| Plain rewrite (no changes) | **None valid today**   | Gate UI or wait for new CMS reason          |

## Round 2 decisions (2026-09-01)

| #   | Decision                                                                               |
| --- | -------------------------------------------------------------------------------------- |
| Q9  | **B** — `{ accountId, renderId, articleId, requestReason }` for v1                     |
| Q10 | **A** — Omit `requestReasonDetail` in v1                                               |
| Q11 | **B** — SingleResult out of scope; remove `console.log` only                           |
| Q12 | **A+C** — Fixture flag after successful fixtures API save; clear on trigger or unmount |
| Q13 | **C** — Restore status on trigger HTTP error; poll-only `failed` for lifecycle         |
| Q14 | **A** — Disabled rewrite control + tooltip explaining preconditions                    |

**Status:** Implemented in Content Hub (pending manual QA).

---

- [ ] Send `.comms/2026-09-01-content-hub-pressbox-rewrite-trigger-contract.md` to CMS (Slack + file in CMS repo under `src/api/pressbox/.comms/`)
- [ ] Get answers to §0 questions (especially plain rewrite + `feedback.count` semantics)
- [ ] Capture one failing 400 response body to confirm `"requestReason is required and must be controlled"`

---

## Phase 2 — Store / API layer

**Files:** `src/store/aiArticles/service.ts`, `src/store/aiArticles/actions.ts`

- [ ] Extend trigger payload type:

```ts
export type TriggerRequestReason =
  | "initial"
  | "editorial_feedback"
  | "source_changed";

export interface TriggerArticlePayload {
  articleId: number;
  accountId?: number;
  renderId?: number;
  requestReason?: TriggerRequestReason;
  requestReasonDetail?: string; // max 500 chars
}
```

- [ ] Update `triggerWeekendArticleFromService` to send new fields
- [ ] Parse CMS errors in `triggerWeekendArticleAction` (match fixture update pattern):

```ts
error?.response?.data?.error?.message ?? error?.message;
```

- [ ] Extend `ArticleStatusData` / trigger response if CMS returns `generationRequestId`, `route`

---

## Phase 3 — Rewrite reason resolution

**New composable (suggested):** `src/composables/aiArticles/useTriggerRequestReason.ts`

Resolve `requestReason` before trigger based on article phase:

| Condition                                                          | `requestReason`                        |
| ------------------------------------------------------------------ | -------------------------------------- |
| No prior successful generation                                     | omit or `"initial"`                    |
| `hasContext` true (context saved this session or fetched on mount) | `"editorial_feedback"`                 |
| Fixtures saved since last successful generation                    | `"source_changed"`                     |
| Neither                                                            | **do not trigger** — show user message |

Track flags in orchestrators:

- `hasContext` — already from `useArticleContext`
- `fixturesChangedSinceLastGeneration` — from `useFixtureEditing` unsaved/saved state (WeekendWrapUp)

---

## Phase 4 — Orchestrator updates

**Files:** `WeekendWrapUp.vue`, `Top5Listicle.vue`, `LadderSummary.vue`, `UpcomingFixtures.vue`

Each `onRequestWriteup()` should:

1. Resolve `requestReason` via composable
2. If no valid reason on rewrite → set `requestError` with actionable copy (e.g. “Add context or edit fixtures before requesting a review”)
3. Call trigger with `{ articleId, requestReason?, accountId?, renderId? }`
4. On error → show CMS `error.message`, **do not** hide existing article on rewrite failure

---

## Phase 5 — UX / lock handling

**Files:** `useArticleFeedback.ts`, `ArticleDisplay.vue`, display components

- [ ] Use API `locked` flag **and** `canProvideFeedback` from status (not only `count >= limit`)
- [ ] On rewrite trigger error when article exists: keep `articleStatus` as `completed`/`waiting` — don’t set store to `failed` and wipe article view
- [ ] Update confirmation dialog copy to explain preconditions:
  - “Request a Review” requires context **or** fixture changes (until CMS adds plain rewrite reason)
- [ ] Map 403 → “Article locked (feedback limit or outside 14-day window)”
- [ ] Map known 400 messages to user-friendly copy

---

## Phase 6 — Verify

Manual test matrix:

| Asset type               | Action                     | Expected `requestReason` | Expected result                |
| ------------------------ | -------------------------- | ------------------------ | ------------------------------ |
| CricketResults           | First write                | `initial` / omitted      | 200 → pending → completed      |
| CricketResults           | Rewrite after context save | `editorial_feedback`     | 200 → pending → completed      |
| CricketResults           | Rewrite after fixture save | `source_changed`         | 200 → pending → completed      |
| CricketResults           | Rewrite with no changes    | —                        | Button disabled or clear error |
| Top5 / Ladder / Upcoming | Rewrite after context      | `editorial_feedback`     | same                           |
| Any                      | Locked article             | —                        | 403, button disabled           |
| Any                      | Article > 14 days          | —                        | 403                            |

---

## Open decisions (waiting on CMS)

1. Plain rewrite without context/fixture — new reason or gate button?
2. Does `feedback.count` include initial generation? (affects lock UI)
3. Feedback limit alignment (3 vs 5 between trigger and status endpoints)
4. Is `requestReasonDetail` needed from Pressbox UI?

---

## File touch list (implementation)

| File                                                                 | Change                                                         |
| -------------------------------------------------------------------- | -------------------------------------------------------------- |
| `src/store/aiArticles/service.ts`                                    | Payload + types                                                |
| `src/store/aiArticles/actions.ts`                                    | Error parsing; optional skip `status=failed` on rewrite errors |
| `src/composables/aiArticles/useTriggerRequestReason.ts`              | **New**                                                        |
| `src/composables/aiArticles/useArticleFeedback.ts`                   | Use `locked` from API                                          |
| `src/pages/asset/assets/media/articleTypes/*.vue`                    | Trigger payload + gating                                       |
| `src/pages/asset/assets/media/articleTypes/_components/*Display.vue` | Error copy, button disable rules                               |
| `src/types/ArticleTypes.ts` or `src/types/aiArticle.ts`              | Shared trigger types                                           |
