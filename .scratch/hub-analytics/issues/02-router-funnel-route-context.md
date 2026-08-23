# 02 — Router funnel + route context on every event

**Status:** resolved  
**Blocked by:** 01 — Analytics foundation

**What to build:** Every Hub navigation emits `$pageview` with `surface: hub` and route-derived context. Depth of the Hub URL also fires the matching catalog event (`hub_opened`, `pack_viewed`, `category_viewed`, `asset_viewed`, or `asset_edit_opened`). Route properties are registered so later action events inherit Account / Pack / category / Asset type without re-plumbing each call site. Deep links into mid-funnel routes still produce the correct depth event.

- [x] `$pageview` fires on Hub route changes with `surface: hub` and available route properties
- [x] `hub_opened` fires once per session on Account landing (`/:accountid`)
- [x] `pack_viewed` fires on Pack (Render) routes
- [x] `category_viewed` fires on grouping category routes
- [x] `asset_viewed` fires on Asset routes
- [x] `asset_edit_opened` fires on the editor route
- [x] Route context is registered globally for subsequent Hub events in the session
- [x] Home `/` is not treated as Hub funnel start
- [x] Unit tests cover route parsing / funnel mapping at the analytics public API
- [x] Verify-and-finish: prefer router-centralised tracking already present; remove duplicate page-level funnel fires if they double-count

## Comments
