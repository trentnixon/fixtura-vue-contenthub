# Fixtura Content Hub — Domain Glossary

## Surface

Where an analytics event originated. One of `marketing_site`, `app`, or `hub`. Every tracked event carries a `surface` property. This repo always emits `hub`.

## Hub

The Fixtura Content Hub — this Vue application. All routes in this app use `surface: hub`.

## Pack

A weekly content bundle. Maps to a **Render** in the API and UI.

## Account

A customer account scoped to content delivery. Identified by `Account.id` (also the `accountid` route parameter).

## Organization

The org that owns one or more accounts. Identified by `accountOrganisationDetails.id`. Used as the PostHog `organization` group key.

## User

Not tracked in Hub. Content Hub has no login — context comes from the URL (`accountid`, `renderid`, etc.). User `identify()` is App/marketing only; journey stitch relies on PostHog's anonymous session when the user arrives from another surface on the same browser.

## Language — Pressbox & writeups

**Pressbox**:
The Press Box panel on asset pages where users generate, review, and copy AI writeups. Routes through the CMS Pressbox trigger path when enabled. User-facing copy lives in `src/constants/pressboxCopy.ts`.
_Avoid_: Articles section (internal layout name only), writeup editor

**Writeup**:
An AI-generated sports article for an asset, stored as an AI Article with `structuredOutput`. Display-only in Hub — no manual body editing.
_Avoid_: Article (ambiguous with CMS entity name), blog post

**Generation trigger**:
A user action that queues AI writeup creation via `POST /api/ai-article/trigger`. First generation and regenerations use the same endpoint.
_Avoid_: Request write-up (legacy UI copy on some buttons)

**Regeneration**:
A generation trigger after a writeup already exists. Requires a controlled `requestReason` on the CMS Pressbox path.
_Avoid_: Rewrite (API/docs term), Request a Review (user-facing label — use in UI only, not in domain docs)

**Editorial context**:
Optional user-provided text (max 1000 characters) saved per writeup to steer regeneration. Persisted as `userFeedbackPrompt` in CMS.
_Avoid_: Context (too generic), feedback (CMS trigger-count term)

**Generation attempt count**:
The number of times a writeup has been triggered, including the first generation. Exposed as `feedback.count` in CMS status responses.
_Avoid_: Feedback count, review count, rewrite count

**Request a Review**:
User-facing label for requesting a regeneration. Implies editorial review, not a separate CMS operation.
_Avoid_: Request rewrite, Regenerate (unless renaming UI deliberately)
