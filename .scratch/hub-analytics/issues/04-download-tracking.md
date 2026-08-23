# 04 — Download tracking (all download surfaces)

**Status:** resolved  
**Blocked by:** 01 — Analytics foundation

**What to build:** Every successful Hub download path (video, single image, bulk/zip, including single-game result galleries) emits `asset_downloaded` with Account, Pack, Asset id, and Asset type. Failed downloads do not count as downloads.

- [x] Successful video download emits `asset_downloaded`
- [x] Successful single-image download emits `asset_downloaded`
- [x] Successful bulk/zip download emits `asset_downloaded` (bulk distinguishable if already supported)
- [x] Weekend / single-game result download UI is covered (no silent gap)
- [x] Event includes `surface: hub` and route/Asset context (`account_id`, `render_id`, `asset_id`, `asset_type`)
- [x] Failed downloads do not emit success events
- [x] Verify-and-finish: audit all download call sites; wire any still missing through the shared download helpers

## Comments
