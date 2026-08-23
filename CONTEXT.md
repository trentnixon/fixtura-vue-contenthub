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

The authenticated Fixtura user (Strapi/backend user record). Identified by backend user id via `identify()` — never by email or account id.
