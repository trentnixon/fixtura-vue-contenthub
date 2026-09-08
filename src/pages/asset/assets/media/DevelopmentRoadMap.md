# Development Roadmap – Media/AI Articles

## ✅ Completed

- [x] Added temporary button to `WeekendWrapUp.vue` with click handler
- [x] Documented media folder structure and dependencies
- [x] POST trigger service (ID + Account ID) and store action (TKT-2025-001)
- [x] Polling service + store action (5s interval, stop conditions) (TKT-2025-001)
- [x] UI wiring: loading state, disable button, error/success feedback (TKT-2025-005)
- [x] Completion: fetch/download article, refresh article list/state (TKT-2025-001)
- [x] Context management (add/edit/delete) (TKT-2025-002)
- [x] Fixture editing interface (view/list/edit) (TKT-2025-003)
- [x] Component refactoring (composables + sub-components) (TKT-2025-004)
- [x] Loading and error state UI improvements (TKT-2025-005)
- [x] Polling interval optimization (5 seconds) (TKT-2025-005)
- [x] UI polish (context badge, button states, debug hiding) (TKT-2025-005)
- [x] Top5Listicle article type with context management and article generation
- [x] LadderSummary article type with context management and article generation
- [x] UpcomingFixtures article type with context management and article generation
- [x] Responsive fixture list improvements (min-height: desktop 450px, mobile 250px)
- [x] Fixture title text wrapping support
- [x] Replace dummy API endpoints with real backend integration (TKT-2025-003 Phase 1)
- [x] Enhanced unsaved changes dialog (save and leave, discard, cancel options)
- [x] Fixture comparison/diff view before saving
- [x] Bulk edit operations (e.g., update date for all fixtures)
- [x] Performance optimization: lazy loading fixture data
- [x] Pressbox rewrite trigger contract (Round 1 + 2): `requestReason`, gating, error UX, shared trigger flow
  - Comms: `.comms/2026-09-01-content-hub-pressbox-rewrite-trigger-contract.md`
  - Plan: `.research/2026-09-01-pressbox-rewrite-implementation.md`
- [x] Article completion polling (Phase A): poll `pending` + `writing`, refetch `structuredOutput` on complete
  - `.research/2026-09-01-article-completion-polling-review.md`
  - `.comms/2026-09-01-content-hub-pressbox-article-completion-polling.md`
- [x] Pressbox failed reset / retry (Hub + CMS TKT-PBX-012): reset call, failed UI, timeout UI, refetch on regen reset
  - `.comms/2026-09-02-content-hub-pressbox-failed-reset-contract.md`
  - `.comms/2026-09-02-cms-handoff-pressbox-failed-reset-hub.md`

## ⏳ To Do (easy → hard)

1. [ ] **Manual QA — Pressbox reset + rewrites** (P1)
   - Restart CMS with TKT-PBX-012 before testing
   - Reset QA: `.comms/2026-09-02-cms-handoff-pressbox-failed-reset-hub.md`
   - Rewrite QA: `.comms/2026-09-01-cms-response-pressbox-section0.md`

## 💡 Recommendations

- Mirror existing store/service patterns (`actions.ts` -> `service.ts` -> private state) ✅ **DONE**
- Centralize auth header creation; handle 401/403 consistently ✅ **DONE**
- Make polling interval and timeout configurable via env or constants ✅ **DONE** (constants file created)
- Ensure clean interval teardown on component unmount ✅ **DONE** (composable handles this)
- Consider adding fixture templates for common match types
- Future enhancement: Allow users to add new fixtures (not just edit existing)
- Consider allowing users to duplicate fixtures for similar matches
