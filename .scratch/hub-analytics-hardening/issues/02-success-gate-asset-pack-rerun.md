# 02 — Success-gate Asset pack_rerun

**What to build:** Failed Asset rerender API outcomes do not emit `pack_rerun` with `trigger: asset`; successful ones still do.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [x] Successful Asset rerender emits `pack_rerun` with `trigger: asset`
- [x] Failed or unsuccessful rerender response does not emit `pack_rerun`
- [x] Unit tests cover this at the downloads store seam with mocked track helpers
