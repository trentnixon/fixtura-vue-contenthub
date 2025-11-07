# Folder Overview

This folder contains reusable Vue components for article types. These components encapsulate UI sections for article display, fixture editing, and context management.

## Files

### Article Display Components

- `ArticleDisplay.vue`: Renders formatted WeekendWrapUp article content (title, subtitle, body, highlights) and ArticleDataForPrompt JSON data

  - Props: `articleStatus`, `formattedArticles`, `isFirstResultForArticle`, `formatPromptData`, `isRequesting`, `isLocked`
  - Emits: `request-writeup`

- `Top5Display.vue`: Renders formatted Top 5 listicle article content with loading, error, and completed states

  - Props: `articleStatus`, `formattedArticles`, `isRequesting`, `isLocked`
  - Emits: `request-writeup`

- `LadderDisplay.vue`: Renders formatted ladder summary article content with loading, error, and completed states

  - Props: `articleStatus`, `formattedArticles`, `isRequesting`, `isLocked`
  - Emits: `request-writeup`

- `UpcomingFixturesDisplay.vue`: Renders formatted upcoming fixtures article content with loading, error, and completed states
  - Props: `articleStatus`, `formattedArticles`, `isRequesting`, `isLocked`
  - Emits: `request-writeup`

### Fixture List Components

- `FixtureList.vue`: Displays list of fixtures with summary cards, loading/empty states, and unsaved changes indicators

  - Props: `fixtures`, `filteredAndSortedFixtures`, `unsavedChanges`, `error`, `getFixtureSummary`
  - Emits: `edit-fixture(index: number)`
  - Features: Responsive min-height (desktop: 450px, mobile: 250px), text wrapping for fixture titles

- `SearchSortControls.vue`: Search input, sort dropdown, and sort order toggle controls
  - Props: `searchQuery` (v-model), `sortBy` (v-model), `sortOrder` (v-model), `filteredCount`, `totalCount`, `showWhenEmpty?`
  - Emits: `update:searchQuery`, `update:sortBy`, `update:sortOrder`

### Fixture Edit Form Components

- `FixtureEditForm.vue`: Main container for fixture edit form with header, error display, and form wrapper

  - Props: `editingFixtureIndex`, `editingFixtureData`, `expandedSections` (v-model), `error?`
  - Emits: `save`, `cancel`, `update:expandedSections`
  - Exposes: `formRef` (for form validation)

- `MatchContextSection.vue`: Match context form fields (competition, grade, date, status, etc.) in expansion panel

  - Props: `matchContext`, `validationRules` (`requiredRule`, `dateRule`)
  - Emits: `update:matchContext`

- `TeamSection.vue`: Reusable team form section for home/away teams with team fields and innings list

  - Props: `team`, `teamType` ('homeTeam' | 'awayTeam'), `validationRules` (`requiredRule`, `scoreFormatRule`, `positiveNumberRule`)
  - Emits: `update:team`, `add-inning`, `remove-inning`, `add-player`, `remove-player`, `add-bowler`, `remove-bowler`, `add-fielder`, `remove-fielder`, `add-wicket`, `remove-wicket`

- `InningsSection.vue`: Innings editor with score/overs/wickets fields and child table components

  - Props: `inning`
  - Emits: `update:inning`, `remove`, `add-player`, `remove-player`, `add-bowler`, `remove-bowler`, `add-fielder`, `remove-fielder`, `add-wicket`, `remove-wicket`

- `AccountBiasSection.vue`: Account bias form fields (isBias, clubTeams, focusedTeams) in expansion panel
  - Props: `accountBias`
  - Emits: `update:accountBias`

### Table Components

- `PlayerStatsTable.vue`: Batting order table with add/remove player functionality

  - Props: `battingOrder` (PlayerStats[])
  - Emits: `add-player`, `remove-player(index: number)`

- `BowlingFiguresTable.vue`: Bowling figures table with add/remove bowler functionality

  - Props: `bowlingFigures` (BowlingFigures[])
  - Emits: `add-bowler`, `remove-bowler(index: number)`

- `FieldingStatsTable.vue`: Fielding stats table with add/remove fielder functionality

  - Props: `fieldingStats` (FieldingStats[])
  - Emits: `add-fielder`, `remove-fielder(index: number)`

- `FallOfWicketsTable.vue`: Fall of wickets table with add/remove wicket functionality
  - Props: `fallOfWickets` (FallOfWickets[])
  - Emits: `add-wicket`, `remove-wicket(index: number)`

### Dialog Components

- `ContextDialog.vue`: Context management dialog with textarea, character counter, and action buttons
  - Props: `modelValue` (v-model), `contextText` (v-model), `hasContext`, `isSaving`, `error`, `success`, `maxLength`, `charCount`, `charRemaining`, `charCountClass`, `isValid`, `cancelLabel`
  - Emits: `update:modelValue`, `save`, `delete`, `close`

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: `WeekendWrapUp.vue` (main orchestrator component)
- Dependencies: Vuetify components, TypeScript types from `@/types/FixtureTypes` and `@/types/ArticleTypes`

## Dependencies

- Internal: `_composables` folder (validation rules, helpers)
- External: Vuetify UI library, Vue 3 composition API
- Primitives: `@/components/primitives/buttons/PrimaryButton.vue`, `SecondaryButton.vue`
