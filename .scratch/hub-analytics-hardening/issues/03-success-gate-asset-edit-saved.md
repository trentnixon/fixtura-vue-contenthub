# 03 — Success-gate asset_edit_saved

**What to build:** Failed CMS saves do not emit `asset_edit_saved`; successful saves still do, with tracking owned on the save success path.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [x] Successful CMS save emits `asset_edit_saved`
- [x] Failed CMS save does not emit `asset_edit_saved`
- [x] Edit UI does not track after a swallowed store error
- [x] Unit tests cover this at the downloads store seam with mocked track helpers
