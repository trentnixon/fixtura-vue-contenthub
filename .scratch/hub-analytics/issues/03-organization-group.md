# 03 — Organization group on Account load

**Status:** resolved  
**Blocked by:** 01 — Analytics foundation

**What to build:** When Account Organisation details load for the route Account, Hub sets PostHog `group("organization", orgId)` using Organisation id (not the URL Account id alone). Analysts can roll up Hub usage by Organization without Hub identifying a User.

- [x] Organization group is set when Account Organisation details are available after Account load
- [x] Group key is Organisation id from Account Organisation details
- [x] No User `identify()` is introduced as part of this work
- [x] Behaviour remains no-op when analytics is disabled or consent is not granted
- [x] Verify-and-finish: confirm existing Account-load hook meets the criteria; fix if Account id was mistakenly used as org group

## Comments
