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
