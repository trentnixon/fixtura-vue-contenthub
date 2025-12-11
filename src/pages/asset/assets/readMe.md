# Folder Overview

Display components for individual asset renders (video, gallery, AI articles, roster posters, single-game results).

## Files

- `AssetDefaultView.vue`: Shared layout for video/image assets with AI article column and tabs on mobile.
- `WeekendSingleGameResult.vue`: Renderer for single result assets.
- `RosterPoster.vue`: Renderer for roster poster assets.
- `components/HowToGuide.vue`: Inline help for asset rendering.
- `AssetState/AssetStateRenderer.vue`: Chooses visual state (processed, error, rerendering) for a given asset.
- `media/`: Article display stack; see `media/readMe.md` for details.
- `errors/`: Error and rerender state components.

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `@/pages/asset/components/AssetController.vue`, `@/pages/render` routing to asset views.
- Consumed by: `src/pages/asset/AssetView.vue`

## Dependencies

- Internal: `@/store/renders` for asset payloads, `@/pages/account/composables/useAccountData`
- External: Vuetify components
