# Folder Overview

This folder contains pure utility functions for fixture data manipulation and formatting. These functions are stateless and can be used independently of Vue components.

## Files

- `fixtureHelpers.ts`: Fixture data manipulation utilities
  - `getFixtureSummary(fixture, index, unsavedChanges)`: Generates summary object for display in fixture list
    - Returns: `{ index, competition, grade, date, ground, homeTeam, awayTeam, homeScore, awayScore, status, hasUnsavedChanges }`

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: `_composables/useFixtureSearchSort.ts`
- Can be used by: Any component or composable that needs fixture summary data

## Dependencies

- External: TypeScript types from `@/types/FixtureTypes`
