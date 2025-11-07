# Folder Overview

This folder contains all AI article type components and their supporting structure. Articles handle AI article generation, context management, and article display with comprehensive loading, error, and success states. Some article types (like WeekendWrapUp) also support fixture editing.

## Files

- `WeekendWrapUp.vue`: Main orchestrator component for weekend wrap-up AI articles

  - Handles article generation workflow (trigger, polling, completion)
  - Manages fixture editing interface
  - Coordinates context management
  - Provides article display with loading/error/success states
  - Integrates with composables for business logic

- `Top5Listicle.vue`: Main orchestrator component for Top 5 listicle AI articles

  - Handles article generation workflow (trigger, polling, completion)
  - Coordinates context management
  - Provides article display with loading/error/success states
  - Uses `useTop5Formatting` composable and `Top5Display` component

- `LadderSummary.vue`: Main orchestrator component for ladder summary AI articles

  - Handles article generation workflow (trigger, polling, completion)
  - Coordinates context management
  - Provides article display with loading/error/success states
  - Uses `useLadderFormatting` composable and `LadderDisplay` component

- `UpcomingFixtures.vue`: Main orchestrator component for upcoming fixtures AI articles

  - Handles article generation workflow (trigger, polling, completion)
  - Coordinates context management
  - Provides article display with loading/error/success states
  - Uses `useUpcomingFixturesFormatting` composable and `UpcomingFixturesDisplay` component

- `SingleResultArticles.vue`: Component for single result article rendering

## Sub-folders

- `_components/`: Reusable UI components for fixture editing and article display
  - See [readMe.md](./_components/readMe.md)
- `_composables/`: Business logic composables for state management and operations
  - See [readMe.md](./_composables/readMe.md)
- `_utils/`: Helper functions for fixture data manipulation
  - See [readMe.md](./_utils/readMe.md)

## Key Features

### Article Generation (All Article Types)

- Trigger article generation via API
- Real-time status polling (5 second interval)
- Loading states with informative messaging
- Error handling with retry functionality
- Success state with article display
- Article lock detection based on feedback count

### Fixture Editing (WeekendWrapUp Only)

- Full fixture list view with search and sort
- Individual fixture edit forms
- Unsaved changes tracking
- Batch save functionality
- Form validation
- Responsive min-height (desktop: 450px, mobile: 250px)
- Text wrapping for fixture titles

### Context Management (All Article Types)

- Add/edit/delete article-level context
- Character counter and validation (1000 char max)
- Context badge indicator
- Context persistence across article regenerations

### UI States

- **Loading**: Spinner with informative copy about wait times
- **Error**: Clear error messages with retry option
- **Success**: Formatted article display
- **Initial**: Call-to-action for article generation

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `@/store/aiArticles`, `@/composables/aiArticles`, Vuetify components
- Consumed by: `AssetDisplayArticle.vue`

## Dependencies

- Internal: `_components`, `_composables`, `_utils` sub-folders
- External: Vue 3, Vuetify, Pinia store, TypeScript types
- Primitives: `@/components/primitives/buttons/IconButton.vue`, `PrimaryButton.vue`
