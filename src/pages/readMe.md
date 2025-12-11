# Folder Overview

Top-level pages for the Content Hub (account, sport, render, grouping, asset, edit flows).

## Files

- `account/`: Account landing and organization-level views.
- `sport/`: Sport selection and overview pages.
- `render/`: Render overview pages (bundle stats, category table).
- `grouping/`: Grouping/category-specific metrics and asset listings.
- `asset/`: Asset detail pages and renderers.
- `edit/`: Editing flows for supported assets.

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `src/router/accountRoutes.ts` (routes into these pages), Pinia stores for data.
- Consumed by: App router and layout components.

## Dependencies

- Internal: `@/store` modules (renders, account, etc.), shared components under `@/components`
- External: Vue Router, Vuetify
