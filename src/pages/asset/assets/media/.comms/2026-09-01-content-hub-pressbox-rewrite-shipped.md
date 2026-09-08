# Pressbox Rewrites — Content Hub Implementation Update

**Date:** 2026-09-01  
**Status:** CMS ack received — ready for joint QA  
**Related:** [2026-09-01-content-hub-pressbox-rewrite-trigger-contract.md](./2026-09-01-content-hub-pressbox-rewrite-trigger-contract.md) · [CMS ack](./2026-09-01-cms-ack-pressbox-rewrite-shipped.md)

---

## Summary

Content Hub has shipped Pressbox rewrite support aligned with the contract in our earlier comms doc. Rewrites now send **`requestReason`** on `POST /api/ai-article/trigger`; plain rewrites without context or fixture changes are **gated in the UI** (button disabled + tooltip) rather than hitting CMS with an invalid payload.

First write is unchanged — **`requestReason` omitted** (CMS defaults to `"initial"`).

---

## What we implemented

### Trigger payload

| Scenario                                  | Payload                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| First write                               | `{ accountId, renderId, articleId }` — no `requestReason`                 |
| Rewrite after saved editorial context     | `{ accountId, renderId, articleId, requestReason: "editorial_feedback" }` |
| Rewrite after fixture save (Weekend Wrap) | `{ accountId, renderId, articleId, requestReason: "source_changed" }`     |

We kept all three IDs during transition for cross-check compatibility. We did **not** send `requestReasonDetail` in v1 — editorial text comes from persisted `userFeedbackPrompt` via the context API only.

### UI gating (“Request a Review”)

| Article type              | Rewrite enabled when…                                    | `requestReason` sent                     |
| ------------------------- | -------------------------------------------------------- | ---------------------------------------- |
| Top 5 / Ladder / Upcoming | Persisted editorial context exists                       | `editorial_feedback`                     |
| Weekend Wrap              | Context saved **or** fixtures saved via API this session | `editorial_feedback` or `source_changed` |
| Any                       | Not locked, not in progress, under generation limit      | —                                        |

If preconditions are not met, the button stays **visible but disabled** with a tooltip explaining why (no context, no fixture save, locked, or generation in progress).

**Plain rewrite** (no context, no fixture change): not offered — matches CMS having no generic regeneration reason today.

### Fixture → `source_changed` flow (Weekend Wrap only)

We set the `source_changed` path only after a **successful** `POST /api/ai-article/fixtures`. The flag clears after a successful trigger or when the user leaves the article view.

**Known edge case:** If the user saves fixtures but the persisted digest is unchanged, CMS may still return 400 on `source_changed`. We surface CMS `error.message` to the user; no Hub-side digest comparison in v1.

### Error handling

- Trigger **400/403** responses: parse and display `error.message` from the CMS body.
- Trigger HTTP failure on rewrite: **does not** mark the writeup as failed — we restore the prior `completed` state.
- Lifecycle **`failed`**: only from poll/status when CMS reports `status === "failed"`, not from rejected trigger calls.

### Generation limit / lock

Rewrite is disabled when status reports `locked`, `canProvideFeedback === false`, or `feedback.count >= feedback.limit`. **`feedback.count` is total trigger attempts** (including first write) per [§0 response](./2026-09-01-cms-response-pressbox-section0.md).

### Scope

- **In scope:** `WeekendWrapUp`, `Top5Listicle` (Top 5, Performances, **Team of the Week**), `LadderSummary`, `UpcomingFixtures`
- **Out of scope:** `SingleResultArticles` (display-only; not Pressbox-eligible in this workflow)

**CMS update (2026-09-02):** `CricketTeamOfTheWeek` routed to Pressbox locally — output `top_scorers[]`, uncapped. See [cms totw routing](./2026-09-02-cms-team-of-the-week-pressbox-routing.md). E2E blocked on local worker `cricket-team-of-the-week@1.0.0`.

---

## CMS ack (2026-09-01)

Contract match confirmed; §0 assumptions correct. Trigger `feedback.limit` fixed to **5**. Restart CMS locally before testing `editorial_feedback` rewrites (`feedbackSnapshot` fix). Details: [cms ack](./2026-09-01-cms-ack-pressbox-rewrite-shipped.md).

---

## What we still need from CMS (§0 — non-blocking)

~~§0 answers~~ — **confirmed**. Limit fix — **done**.

§0 reference + QA table: [2026-09-01-cms-response-pressbox-section0.md](./2026-09-01-cms-response-pressbox-section0.md)

---

## Test scenarios (for joint QA)

Full matrix with §0 pass criteria: [2026-09-01-cms-response-pressbox-section0.md](./2026-09-01-cms-response-pressbox-section0.md#hub-qa-table-with-0-expectations)

| #   | Steps                                          | Expected                                            |
| --- | ---------------------------------------------- | --------------------------------------------------- |
| 1   | First write on completed-eligible article      | 200, no `requestReason` in request                  |
| 2   | Save context → Request a Review                | 200, `requestReason: "editorial_feedback"`          |
| 3   | Weekend Wrap: save fixtures → Request a Review | 200, `requestReason: "source_changed"`              |
| 4   | Completed article, no context/fixture change   | Button disabled; no trigger call                    |
| 5   | Locked / over limit article                    | Button disabled; 403 message if triggered elsewhere |
| 6   | Trigger 400 (e.g. unchanged digest)            | Writeup remains visible; CMS message shown          |

---

## Hub code references

- Trigger types & service: `src/store/aiArticles/service.ts`
- Trigger action + status restore: `src/store/aiArticles/actions.ts`
- Reason resolution & gating: `src/composables/aiArticles/pressboxTrigger.ts`
- Shared trigger/poll flow: `src/composables/aiArticles/useArticleTriggerFlow.ts`
- Error parsing: `src/composables/aiArticles/parseTriggerError.ts`

---

## Slack version

> **Pressbox rewrites — Content Hub shipped**
> Following our trigger contract comms: Hub now sends `requestReason` on rewrites (`editorial_feedback` after context API, `source_changed` after fixture save on Weekend Wrap). First write unchanged. Plain rewrite gated in UI. We parse CMS `error.message` on 400/403 and don’t wipe existing writeups on trigger failure. Still happy to confirm §0: `feedback.count` semantics, limit 3 vs 5 alignment, and `source_changed` when fixture data is unchanged. Ready for joint QA on the scenarios above.
