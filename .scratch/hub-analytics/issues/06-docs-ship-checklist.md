# 06 — Spec docs, catalog handoff, and ship checklist

**Status:** resolved  
**Blocked by:** 02 — Router funnel; 03 — Organization group; 04 — Download tracking; 05 — Edit save / pack rerun / roster

**What to build:** Hub documentation matches the shipped catalog so marketing/App can sync without reading source. A short ship checklist covers consent cookie dependency, env vars, optional `/ingest` proxy, and joint QA for marketing → App → Hub download stitch. This ticket does not implement App, marketing, or API analytics.

- [x] Hub handoff event catalog matches events actually emitted (names, triggers, key properties)
- [x] `CONTEXT.md` glossary remains aligned (Surface, Hub, Pack, Account, Organization, User-not-on-Hub)
- [x] Ship checklist documents: consent cookie contract, `NEXT_PUBLIC_*` env, prod `/ingest` as infra follow-up, joint QA stitch steps
- [x] Out-of-scope items (App identify, marketing catalog PR, server events) are explicitly listed as external
- [x] Verify-and-finish: update docs to reality; do not invent events that are not shipped

## Comments
