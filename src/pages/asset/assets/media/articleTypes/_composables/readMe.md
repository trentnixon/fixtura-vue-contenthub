# Folder Overview

This folder contains Vue 3 composables that encapsulate business logic for article types. These composables provide reactive state management, computed properties, and methods for article formatting, fixture editing, context management, search/sort, and validation.

## Files

### Article Formatting Composables

- `useArticleFormatting.ts`: Article formatting and display logic for WeekendWrapUp articles

  - **Computed**: `formattedArticles`, `hasArticle`, `firstAssetDetails`
  - **Methods**: `isFirstResultForArticle()`, `formatPromptData()`, `copyArticle()`
  - **Parameters**: `articles: Ref<FlattenedArticle[]>`

- `useTop5Formatting.ts`: Article formatting and display logic for Top 5 listicle articles

  - **Computed**: `formattedArticles`, `hasArticle`, `firstAssetDetails`
  - **Methods**: `isFirstResultForArticle()`, `formatPromptData()`, `copyArticle()`
  - **Parameters**: `articles: Ref<FlattenedArticle[]>`
  - **Types**: `Top5ListicleArticle`, `FormattedTop5Article`

- `useLadderFormatting.ts`: Article formatting and display logic for ladder summary articles

  - **Computed**: `formattedArticles`, `hasArticle`, `firstAssetDetails`
  - **Methods**: `isFirstResultForArticle()`, `formatPromptData()`, `copyArticle()`
  - **Parameters**: `articles: Ref<FlattenedArticle[]>`
  - **Types**: `League`, `FormattedLadderArticle`

- `useUpcomingFixturesFormatting.ts`: Article formatting and display logic for upcoming fixtures articles
  - **Computed**: `formattedArticles`, `hasArticle`, `firstAssetDetails`
  - **Methods**: `isFirstResultForArticle()`, `formatPromptData()`, `copyArticle()`
  - **Parameters**: `articles: Ref<FlattenedArticle[]>`
  - **Types**: `UpcomingFixture`, `FormattedUpcomingFixturesArticle`

### Context Management

- `useArticleContext.ts`: Article context management (save, fetch, delete)
  - **State**: `showContextDialog`, `contextText`, `isSavingContext`, `contextError`, `contextSuccess`, `hasContext`
  - **Constants**: `CONTEXT_MAX_LENGTH` (1000)
  - **Computed**: `contextCharCount`, `contextCharRemaining`, `isContextValid`, `contextCharCountClass`, `cancelButtonLabel`
  - **Methods**: `onAddContext()`, `fetchExistingContext()`, `closeContextDialog()`, `handleSaveContext()`, `handleDeleteContext()`
  - **Parameters**: `accountId: () => number | null`, `renderId: () => number | null`, `articleId: () => number | null`

### Fixture Editing Composables (WeekendWrapUp Only)

- `useFixtureEditing.ts`: Fixture CRUD operations and array manipulation helpers

  - **State**: `isEditingFixtures`, `fixtures`, `editingFixtureIndex`, `editingFixture`, `unsavedChanges`, `isSavingFixtures`, `fixtureError`, `expandedSections`, `fixtureFormRef`
  - **Computed**: `hasUnsavedChanges`, `fixtureCount`, `editingFixtureData`
  - **Methods**: `loadFixtures()`, `onMakeEditToFixture()`, `onBackToArticle()`, `onSaveAllChanges()`, `onEditFixture()`, `onCancelEdit()`, `onSaveFixture()`, `addInning()`, `removeInning()`, `addPlayer()`, `removePlayer()`, `addBowler()`, `removeBowler()`, `addFielder()`, `removeFielder()`, `addWicket()`, `removeWicket()`
  - **Parameters**: `articles: Ref<FlattenedArticle[]>`, `accountId: () => number | null`, `renderId: () => number | null`, `articleId: () => number | null`

- `useFixtureValidation.ts`: Form validation rules for fixture fields

  - **Exports**: `requiredRule`, `scoreFormatRule`, `positiveNumberRule`, `dateRule`
  - **Type**: `ValidationRule = (value: any) => boolean | string`
  - **Function**: `useFixtureValidation()` returns all validation rules

- `useFixtureSearchSort.ts`: Search, filter, and sort logic for fixture list
  - **State**: `searchQuery`, `sortBy`, `sortOrder`
  - **Computed**: `filteredAndSortedFixtures` (with original index mapping)
  - **Functions**: `getFixtureSummary()` (imported from `_utils/fixtureHelpers.ts`)
  - **Parameters**: `fixtures: Ref<ParsedFixturePrompt[]>`

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: `WeekendWrapUp.vue`, `Top5Listicle.vue`, `LadderSummary.vue`, `UpcomingFixtures.vue` (main orchestrator components)
- Dependencies: `_utils/fixtureHelpers.ts`, store actions (`@/store/aiArticles/actions`), TypeScript types

## Dependencies

- Internal: `_utils` folder (helper functions)
- External: Vue 3 reactivity (`ref`, `computed`), Pinia store actions, TypeScript types from `@/types/FixtureTypes` and `@/types/ArticleTypes`
