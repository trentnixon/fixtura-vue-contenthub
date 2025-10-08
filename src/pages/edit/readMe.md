# Folder Overview

Handles asset editing functionality for Fixtura assets including cricket results, ladders, top players, and fixtures.

## Files

- `processEdit.vue`: main edit view, dynamically renders asset-specific edit components based on normalized lowercase asset type
- `composables/useFixturaAsset.js`: fetches asset data from store using route query params, ensures selectedFixturaAsset is populated before accessing download data
- `composables/useSaveFixturaAsset.js`: handles saving edited data back to CMS, deep merges updates
- `validations/genericValidations.ts`: reusable validation functions (name, number, date, time, range)
- `components/HeaderSection.vue`: header component showing asset-specific titles, normalizes asset type to lowercase for consistent lookup

## AssetEditPortals

Asset-specific edit components:

- `WeekendResultsEdit.vue`: edits fixture results with drag-and-drop reordering
- `LadderEdit.vue`: edits ladder/standings data
- `Top5Edit.vue`: edits top 5 player statistics (batting/bowling)
- `UpComingFixturesEdit.vue`: edits upcoming fixtures
- `Sections/`: reusable section components (VideoMetaDataEdit, fixtureResultItem, TopPlayerItem, upcomingFixtureItem)
- `formElements/`: input components (ColorInput, DropdownInput, ImageInput, MediaImageInput, TextInput, PerformanceEditor)

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `@/store/downloads`, `@/store/account`, `@/pages/asset/composables/useRenderAssets`
- Consumed by: router, asset management flow

## Dependencies

- Internal: `store/downloads`, `store/account`, `pages/asset/composables`
- External: vue3-smooth-dnd (drag-and-drop), vuetify, lodash
