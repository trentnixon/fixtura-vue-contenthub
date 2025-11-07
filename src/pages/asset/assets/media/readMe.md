# Folder Overview

Handles media rendering within the Asset view, including the AI Articles section.

## Files

- `AssetDefaultView.vue`: Assembles Video, Articles, and Gallery sections for an asset.
- `media/AssetDisplayArticle.vue`: Article container using `MediaLayout` slots (header, loading, body, noContent).
- `media/articleTypes/WeekendWrapUp.vue`: Weekend results AI article renderer with fixture editing, context management, and article generation.
- `media/articleTypes/Top5Listicle.vue`: Top 5 listicle AI article renderer with context management and article generation.
- `media/articleTypes/LadderSummary.vue`: Ladder summary AI article renderer with context management and article generation.
- `media/articleTypes/UpcomingFixtures.vue`: Upcoming fixtures AI article renderer with context management and article generation.
- `media/articleTypes/SingleResultArticles.vue`: Single result article renderer.

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `@/store/aiArticles`, `@/components/containers/media/mediaLayout.vue`
- Consumed by: `src/pages/asset/assets/AssetDefaultView.vue`

## Dependencies

- Internal: `@/store/aiArticles`, `@/pages/asset/composables/useRenderAssets`
- External: Vuetify components
