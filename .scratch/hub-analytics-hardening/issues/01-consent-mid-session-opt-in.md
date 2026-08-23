# 01 — Consent mid-session opt-in

**What to build:** Granting the shared analytics consent cookie after Hub has already initialized turns capture on without a reload; deny stays off.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [x] After init without consent, granting consent allows subsequent Hub catalog capture
- [x] Denied consent keeps capture off
- [x] Unit tests cover this at the analytics public API seam
