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

- `WeekendResultsEdit.vue`: edits fixture results with drag-and-drop reordering, handles case-insensitive data access (`DATA`/`data`, `VIDEOMETA`/`videoMeta`)
- `LadderEdit.vue`: edits ladder/standings data, handles case-insensitive data access
- `Top5Edit.vue`: edits top 5 player statistics (batting/bowling), handles case-insensitive asset type matching and data access
- `UpComingFixturesEdit.vue`: edits upcoming fixtures, handles case-insensitive data access
- `Sections/`: reusable section components (VideoMetaDataEdit, fixtureResultItem, TopPlayerItem, upcomingFixtureItem)
- `formElements/`: input components (ColorInput, DropdownInput, ImageInput, MediaImageInput, TextInput, PerformanceEditor)

All edit portals support both uppercase and lowercase field names for backward compatibility and consistent data handling.

## Navigation

- Edit mode detection: Navigation components (`TopNavigation.vue`) automatically hide quick select buttons (asset & category) when in edit mode (`route.name === "processEdit"` or `route.path.includes("/edit/")`).

## Rerender Functionality

- `CricketResultSingle` assets: Added rerender ("Apply Edits") functionality to `WeekendSingleGameResult.vue` component with loading states during processing.
- All other asset types: Rerender functionality provided through `AssetDefaultView` component which uses `AssetStateRenderer` to handle video and image gallery rerendering.

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `@/store/downloads`, `@/store/account`, `@/pages/asset/composables/useRenderAssets`
- Consumed by: router, asset management flow

## Dependencies

- Internal: `store/downloads`, `store/account`, `pages/asset/composables`
- External: vue3-smooth-dnd (drag-and-drop), vuetify, lodash
