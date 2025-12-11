# Folder Overview

Renders individual assets for a render bundle, handling routing into specific asset types (results, ladders, top lists, performances, rosters).

## Files

- `AssetView.vue`: Page wrapper that fetches render/grouping data and loads `AssetController`.
- `components/AssetController.vue`: Maps asset types to render components and formats asset/article data.
- `components/HeaderSection.vue`: Header and navigation actions for the asset page.
- `composables/useAssetState.ts`: Derives display state for a single asset payload.
- `assets/`: Asset-specific renderers and shared asset layouts.

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `@/store/renders`, `@/pages/account/composables/useAccountData`
- Consumed by: `src/router/accountRoutes.ts` (`:asset` route)

## Dependencies

- Internal: `@/utils/useGlobalComposable`, `@/pages/render` data flow, `@/pages/grouping` navigation
- External: Vuetify components
