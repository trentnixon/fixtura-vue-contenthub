# CMS ack — Pressbox `user_requested_regeneration`

**Date:** 2026-09-09  
**From:** CMS team  
**To:** Content Hub  
**Ticket:** TKT-PBX-013  
**CMS source (canonical):** `src/api/pressbox/.comms/2026-09-09-cms-ack-pressbox-user-requested-regeneration.md`  
**Hub mirror:** [./2026-09-09-cms-ack-pressbox-user-requested-regeneration.md](./2026-09-09-cms-ack-pressbox-user-requested-regeneration.md) (this file — keep in sync with CMS source)  
**Related:** [Hub request](./2026-09-09-content-hub-pressbox-user-requested-regeneration.md) · `CMS_IMPLEMENTATION_DECISIONS_2026-08-18.md` §4 (updated)

---

## Summary

CMS will ship **`user_requested_regeneration`** on the Pressbox trigger path. Round 1 product decisions and Round 2 execution choices are **locked** below. Hub’s shipped implementation **aligns**; no Hub change required for v1 unless product revisits Q3 or Q4.

**Hub may ship before CMS.** Plain regen **400** until **TKT-PBX-013** is live is **expected** — not a Hub bug (Q8, Q10).

**Deploy order:** CMS staging → joint QA row #1 → production. Do not run row #1 until CMS + Hub share the same environment with TKT-PBX-013 deployed.

---

## Round 1 — decisions (locked)

| #      | Question                                       | Decision                                                                          |
| ------ | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| **Q1** | Accept name `user_requested_regeneration`?     | **Yes** — keep name; aligned Sept 1 contract; snake_case controlled value.        |
| **Q2** | Evidence-free at CMS on purpose?               | **Model A** — enum + lock / limit / window only; no digest/snapshot precondition. |
| **Q3** | Persisted `userFeedbackPrompt` on plain regen? | **A (v1)** — may still apply in worker snapshot; not required.                    |
| **Q4** | Persisted context ⇒ `editorial_feedback`?      | **Accept Hub priority for v1** — CMS does not infer intent from article state.    |
| **Q5** | Same worker prompt path or variation?          | **Same path** — variation out of scope.                                           |
| **Q6** | Same `feedback.limit` (5)?                     | **Yes** — one counter for all triggers.                                           |
| **Q7** | Ship scope                                     | Enum + tests + §4 docs + this ack + **TKT-PBX-013**.                              |
| **Q8** | Pre-deploy Hub 400?                            | Expected until CMS deploy; Hub surfaces `error.message`.                          |

---

## Round 2 — implementation (locked)

| #       | Question                              | Decision                                                                                                                                                                                                                                                                                                                                                              |
| ------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Q9**  | Pressbox worker job schema            | **Confirm with Pressbox team before CMS deploy.** `pressboxQueueProducer.js` rejects unknown `requestReason` (lines 71–72). Worker Zod may allow only `initial \| source_changed \| editorial_feedback`. Extend worker enum in same release **or** get written confirmation unknown reasons pass dequeue validation. **CMS-only deploy is risky** without this check. |
| **Q10** | Deploy / QA sequencing                | **CMS staging first**, then Hub verifies QA row #1 (`user_requested_regeneration` → **200**). Hub 400 pre-deploy is correct — do not file as Hub bug.                                                                                                                                                                                                                 |
| **Q11** | Where CMS ack lives                   | **Canonical:** `src/api/pressbox/.comms/2026-09-09-cms-ack-pressbox-user-requested-regeneration.md` (matches TKT-PBX-011/012). Hub request doc links to ack.                                                                                                                                                                                                          |
| **Q12** | Schema migration evidence             | **Local `npm run test:pressbox` + Strapi schema sync** sufficient (TKT-PBX-008 pattern). Fold into TKT-PBX-013 — no TKT-PBX-010 unless staging hits enum drift.                                                                                                                                                                                                       |
| **Q13** | Document stale-context nuance on CMS? | **Yes** — one paragraph in this ack under **Known behaviour (v1)** for CMS support. Not in Hub `CONTEXT.md` (defer until Pressbox glossary).                                                                                                                                                                                                                          |

---

## Known behaviour (v1) — support note (Q13)

Users may report “plain regen” but Hub sends **`editorial_feedback`** because **`userFeedbackPrompt` still exists** on the article from an earlier session (Q4). That is **intentional v1 Hub priority**, not a CMS trigger bug. Support should check whether context exists before expecting `user_requested_regeneration` in logs. Product change to prefer plain regen over stale context = **Hub-only** priority change in a future release.

---

## CMS implementation (TKT-PBX-013)

| Area              | Action                                                                                |
| ----------------- | ------------------------------------------------------------------------------------- |
| Trigger enum      | Add `user_requested_regeneration` to `REQUEST_REASONS` / trigger validation           |
| Queue producer    | Extend `pressboxQueueProducer.js` allowlist (Q9)                                      |
| Worker job schema | Extend Zod enum **or** confirm pass-through (Q9 — **blocker before deploy**)          |
| Schema / DB       | `generation-request/schema.json` + Strapi enum sync; `npm run test:pressbox` (Q12)    |
| Preconditions     | Evidence-free at trigger — lock / limit / window only (Q2)                            |
| Docs              | Update `CMS_IMPLEMENTATION_DECISIONS_2026-08-18.md` §4                                |
| Tests             | Trigger accepts plain regen after success; worker job validates new reason end-to-end |

---

## Controlled `requestReason` values (updated)

| Value                               | CMS preconditions                          |
| ----------------------------------- | ------------------------------------------ |
| `"initial"`                         | First write only                           |
| `"editorial_feedback"`              | Bounded feedback snapshot required         |
| `"source_changed"`                  | Prior digest; current digest must differ   |
| **`"user_requested_regeneration"`** | Prior successful generation; evidence-free |

---

## Hub alignment check

| Hub behaviour                                                                     | Matches |
| --------------------------------------------------------------------------------- | ------- |
| Sends `user_requested_regeneration` when no fixture save + no persisted context   | ✅      |
| Priority: `source_changed` → `editorial_feedback` → `user_requested_regeneration` | ✅ Q4   |
| No UI gate except lock / pending                                                  | ✅      |
| Does not clear context before plain regen                                         | ✅ Q3-A |
| Surfaces CMS `error.message` on 400 pre-deploy                                    | ✅ Q8   |

---

## Joint QA (after CMS staging deploy)

| #     | Scenario                                     | Request                       | Pass                               |
| ----- | -------------------------------------------- | ----------------------------- | ---------------------------------- |
| **1** | Completed writeup, no context/fixture change | `user_requested_regeneration` | **200** + worker job dequeues (Q9) |
| **2** | Context on article (any age)                 | `editorial_feedback`          | **200**                            |
| **3** | Weekend Wrap, fixtures saved                 | `source_changed`              | **200**                            |
| **4** | Old context, user clicks Review              | `editorial_feedback` (Q4/Q13) | **200** — not plain regen          |
| **5** | Locked / at limit                            | any regen                     | **403** or disabled UI             |
| **6** | Failed regen → reset → retry                 | `user_requested_regeneration` | Reset **200** → trigger **200**    |

Full matrix: [Hub request § QA](./2026-09-09-content-hub-pressbox-user-requested-regeneration.md#qa-matrix-joint)

---

## Slack version

> **CMS ack — `user_requested_regeneration` (Round 1 + 2)**  
> Product locked. Execution: confirm worker/queue enum before deploy (Q9); CMS staging → Hub QA row #1 (Q10); ack canonical in `src/api/pressbox/.comms/`; local `test:pressbox` + schema sync in TKT-PBX-013 (Q12). Hub may ship first — 400 until live is expected. Support: stale context ⇒ Hub sends `editorial_feedback`, not plain regen (Q13).
