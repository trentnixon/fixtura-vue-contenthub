# Team of the Week — CMS Pressbox Routing (Local)

**Date:** 2026-09-02  
**Status:** CMS ack received — aligned; joint QA blocked on worker package  
**From:** CMS  
**To:** Content Hub  
**Related:** [Pressbox rewrites shipped](./2026-09-01-content-hub-pressbox-rewrite-shipped.md) · [Trigger contract](./2026-09-01-content-hub-pressbox-rewrite-trigger-contract.md)

---

## Summary

CMS has routed **Team of the Week** to Pressbox on local. Composition key: **`CricketTeamOfTheWeek`**. Trigger, status polling, and rewrite semantics match the Top 5 / Performances family.

---

## CMS contract

| Field            | Value                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Composition      | `CricketTeamOfTheWeek`                                                                                       |
| Trigger / status | Same as Top 5 / Performances (`POST /api/ai-article/trigger` → poll `status`)                                |
| Output family    | `top_scorers[]` — **not** `results[]`                                                                        |
| Row count        | **Uncapped** — mixed batter / bowler / twelfth-man rows in one array                                         |
| Rewrites         | Same `requestReason` rules as other Pressbox articles (`editorial_feedback` after context; no plain rewrite) |

---

## E2E blocker (local)

Local Pressbox worker must include composition package **`cricket-team-of-the-week@1.0.0`**. Without it, trigger may succeed but generation will not complete.

---

## Content Hub alignment

Hub already treats `CricketTeamOfTheWeek` as Pressbox-eligible via the Top 5 listicle path:

| Concern            | Hub status                                                                |
| ------------------ | ------------------------------------------------------------------------- |
| Article component  | `Top5Listicle` via `AssetDisplayArticle.vue`                              |
| Player list key    | `extractPlayerList` tries `top_scorers` first                             |
| Row cap            | None — renders full `topScorers` array                                    |
| Rewrite gating     | Shared `pressboxTrigger.ts` / `useArticleTriggerFlow.ts`                  |
| TOTW-specific copy | `pressboxCopy.ts` (`getTop5EmptyStateCopy`, `getTop5InitialConfirmation`) |

**No Hub code changes required** for this CMS routing update. Joint QA blocked on local worker package until `cricket-team-of-the-week@1.0.0` is installed.

---

## CMS ack (2026-09-02)

Hub alignment confirmed — no conflicts with CMS implementation or local verification.

| Hub claim                            | CMS confirms                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------- |
| TOTW Pressbox-eligible               | Yes — `CricketTeamOfTheWeek` in `eligibility.js`; routes to Pressbox when `PRESSBOX_ENABLED=true` |
| Same path as Top 5 / Performances    | Yes — `getStructuredOutputFamily` → `top5` / `top_scorers[]`                                      |
| `top_scorers[]`, not `results[]`     | Yes — `/complete` validated that way; mixed-role test passes                                      |
| Uncapped array                       | Yes — no max length in CMS validator                                                              |
| Rewrite `requestReason` rules shared | Yes — same `POST /api/ai-article/trigger` path for all eight eligible IDs                         |
| E2E blocked on worker                | Yes — cricket rankings subtype not implemented on a real local job yet                            |

CMS cannot verify Hub file names from their repo; prior comms already listed TOTW as Pressbox-eligible and `Top5Listicle` in rewrite scope — routing through that display path is consistent.

**Bottom line:** Hub needs no code changes. Joint QA blocked on Pressbox worker shipping `cricket-team-of-the-week@1.0.0`. Once that runs, trigger → poll → `structuredOutput.top_scorers[]` → display should work end-to-end.

---

## QA scenarios (TOTW)

**Rewrite note:** `source_changed` (fixture save) is **Weekend Wrap only**. Not applicable to TOTW — rewrites are context-only (`editorial_feedback`) or disabled if no context, same as Top 5 / Ladder / Upcoming in Hub's gating table.

| #   | Steps                               | Expected                                                         |
| --- | ----------------------------------- | ---------------------------------------------------------------- |
| 1   | First write on completed TOTW asset | 200, no `requestReason`; poll → `completed` with `top_scorers[]` |
| 2   | Save context → Request a Review     | 200, `requestReason: "editorial_feedback"`                       |
| 3   | Completed, no context               | Button disabled; no trigger                                      |
| 4   | Verify mixed row types              | All rows render (XI + twelfth man); no 5-item cap                |
| 5   | Locked / over limit                 | Button disabled                                                  |

---

## Slack version

> **TOTW → Pressbox (local)** — CMS routed `CricketTeamOfTheWeek` to Pressbox. Same trigger/status/rewrite flow as Top 5 / Performances. Output is `top_scorers[]` (uncapped, mixed roles). Hub already aligned — no changes needed. **E2E blocked** until local Pressbox worker has `cricket-team-of-the-week@1.0.0`.
