# Article completion — polling review (Content Hub)

**Date:** 2026-09-01  
**Status:** Phase A implemented (2026-09-01)  
**Symptom:** UI does not reliably update when CMS finishes generating a writeup

---

## What exists today

| Piece              | Location                      | Behaviour                                                    |
| ------------------ | ----------------------------- | ------------------------------------------------------------ |
| Status API         | `POST /ai-article/status`     | Returns `status`, `locked`, `feedback`, `timestamps`         |
| Polling composable | `useArticlePolling.ts`        | 5s interval, 5min max                                        |
| Trigger flow       | `useArticleTriggerFlow.ts`    | Trigger → one status check → start polling if `pending`      |
| Mount resume       | Each orchestrator `onMounted` | Status check → poll if `pending`                             |
| Store              | `pollWeekendArticleStatus`    | Updates `storeState.status`                                  |
| UI phase           | `useArticleStatus.ts`         | Maps status → `articlePhase`                                 |
| Content display    | Props from render fetch       | `structuredOutput` on `articles[]` — **not** from poll/store |
| Completion refresh | `triggerDataSync()`           | `router.go(0)` full page reload                              |
| Download helper    | `GET /cms/ai-articles/:id`    | Called on poll complete; **result unused**                   |

---

## Gaps (why UI feels broken)

### 1. Polling stops on `writing`

`useArticlePolling` stops when `status !== "pending"`:

```ts
if (status !== "pending") {
  stopPolling();
  if (status === "completed") { ... }
}
```

CMS contract documents `writing` as a valid in-progress state. If Pressbox transitions `pending → writing → completed`, **polling stops at `writing`** and never reaches `completed`.

Same issue in orchestrator watchers: `isPending` and `stopPolling` only treat `"pending"` as in-flight.

### 2. Completion refresh is fragile

- Data sync watcher: only `pending → completed` (misses `writing → completed`).
- `useArticleTriggerFlow` passes **`onComplete: undefined`** to `startPolling`.
- `fetchWeekendArticleDownload` does not update props/store.
- Display depends on **parent render data**; poll updating store status alone does not show new copy.

### 3. Logic duplicated ×4

Mount resume, status watchers, and `triggerDataSync` are copy-pasted across `WeekendWrapUp`, `Top5Listicle`, `LadderSummary`, `UpcomingFixtures`.

### 4. Download endpoint unclear

`fetchWeekendArticleDownloadFromService` hits `GET /cms/ai-articles/:id` with a “dummy” comment — may not be the canonical post-Pressbox fetch path.

---

## Proposed solution (two phases)

### Phase A — Hub-only (no CMS contract change)

Assuming CMS emits `pending` and/or `writing` until done:

1. **Poll while in-flight:** `status ∈ { pending, writing }`.
2. **Centralize** mount resume + completion in `useArticleTriggerFlow` or a new `useArticleCompletionWatch`.
3. **On `completed`:**
   - Stop polling
   - Refetch article content (endpoint TBD with CMS)
   - Update UI without full page reload if possible
4. **Wire `onComplete`** to emit refresh event or call parent refetch.
5. **Align `isPending`** with in-flight statuses (`pending` + `writing`).

### Phase B — CMS enhancement (optional, better UX)

Ask CMS to clarify/support one of:

| Option | CMS change                                                      | Hub benefit                              |
| ------ | --------------------------------------------------------------- | ---------------------------------------- |
| **B1** | Document guaranteed status FSM for Pressbox                     | Hub polls correct states                 |
| **B2** | Status returns `structuredOutput` (or summary) when `completed` | Single poll updates UI — no second fetch |
| **B3** | Document canonical GET for fresh article after generation       | Replace dummy download + `router.go(0)`  |
| **B4** | Return `generationRequestId` + optional status-by-request       | Debug + future multi-tab consistency     |

Webhooks/SSE from CMS to Hub SPA are likely out of scope (no persistent Hub backend on asset page).

---

## CMS input needed

See `.comms/2026-09-01-content-hub-pressbox-article-completion-polling.md`.

---

## Recommended Hub implementation order (after CMS answers)

1. Fix in-flight status set in `useArticlePolling` (+ orchestrator watchers).
2. Add shared `onGenerationComplete` callback (refetch + clear pending).
3. Remove duplicated mount logic from orchestrators.
4. Replace `router.go(0)` with targeted render/article refetch if CMS confirms endpoint.
5. Manual QA: first write, rewrite, navigate away + return mid-generation, timeout.
