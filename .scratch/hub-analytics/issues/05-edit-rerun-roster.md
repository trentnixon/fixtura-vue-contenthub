# 05 — Edit save, pack rerun, and roster intents

**Status:** resolved  
**Blocked by:** 01 — Analytics foundation; 02 — Router funnel + route context

**What to build:** Hub records the high-value delivery actions beyond navigation: successful editor save, Asset-level and Pack-level rerun, and roster sync/create confirmations. Pack-level rerun includes reason when the user selected one. These events inherit registered route context from navigation where applicable.

- [x] Successful editor CMS save emits `asset_edit_saved` with download/Asset/route context available
- [x] Successful Asset rerender API emits `pack_rerun` with `trigger: asset`
- [x] Successful Pack rerender request emits `pack_rerun` with `trigger: pack_request` and `reason` when provided
- [x] Confirming PlayHQ roster sync emits `roster_sync_requested`
- [x] Confirming create roster emits `roster_create_requested`
- [x] Events carry `surface: hub`; Account/Pack/category properties present when known
- [x] Failures / cancelled confirms do not emit success/intent events inappropriately
- [x] Verify-and-finish: confirm existing hooks; fill gaps only

## Comments
