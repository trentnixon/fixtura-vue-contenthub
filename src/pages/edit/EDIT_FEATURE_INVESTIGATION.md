# Edit Feature Investigation Report

**Date:** 2025-01-XX
**Scope:** Asset editing functionality for Fixtura assets
**Status:** Edit buttons currently disabled due to data fetching issues

---

## Executive Summary

The edit feature allows users to modify cricket asset data (results, ladders, top players, fixtures) through a dedicated edit interface. The feature is functionally complete but currently disabled due to data fetching issues. The edit buttons in `HeaderSection.vue` and `AssetController.vue` are commented out, waiting for data fetching resolution (TKT-2025-003).

---

## Architecture Overview

### Component Structure

```
src/pages/edit/
├── processEdit.vue                 # Main edit entry point
├── components/
│   └── HeaderSection.vue           # Edit page header with back button
├── composables/
│   ├── useFixturaAsset.js         # Fetches asset data from store/API
│   └── useSaveFixturaAsset.js     # Saves edited data back to CMS
├── AssetEditPortals/
│   ├── WeekendResultsEdit.vue     # Edit weekend results/fixtures
│   ├── LadderEdit.vue             # Edit ladder (read-only)
│   ├── Top5Edit.vue               # Edit top 5 players (batting/bowling)
│   ├── UpComingFixturesEdit.vue  # Edit upcoming fixtures
│   ├── Sections/                  # Reusable section components
│   │   ├── fixtureResultItem.vue
│   │   ├── TopPlayerItem.vue
│   │   ├── upcomingFixtureItem.vue
│   │   └── VideoMetaDataEdit.vue
│   └── formElements/              # Form input components
│       ├── TextInput.vue
│       ├── ColorInput.vue
│       ├── DropdownInput.vue
│       ├── ImageInput.vue
│       ├── MediaImageInput.vue
│       └── PerformanceEditor.vue
└── validations/
    └── genericValidations.ts      # Validation functions
```

---

## Data Flow

### 1. Navigation to Edit Page

**Entry Points:**

- `HeaderSection.vue` (commented out) - Main edit button
- `AssetController.vue` (commented out) - Secondary edit button
- `RosterPoster.vue` - Active "Edit Rosters" button (different functionality)

**Navigation Function:**

```javascript
// Located in HeaderSection.vue (lines 50-68)
function navigateToEdit() {
  router.push({
    name: "processEdit",
    query: {
      accountid: route.params.accountid,
      sport: route.params.sport,
      renderid: route.params.renderid,
      groupingcategory: route.params.groupingcategory,
      asset: route.params.asset,
    },
  });
}
```

### 2. Edit Page Initialization

**`processEdit.vue`:**

1. Determines asset type from route query params or store
2. Maps asset type to appropriate edit component
3. Renders edit portal component dynamically
4. Blocks access if asset type is invalid or unsupported

**Asset Type Mapping:**

```javascript
const assetEditComponents = {
  cricketresults: WeekendResultsEdit,
  cricketladder: LadderEdit,
  crickettop5bowling: Top5Edit,
  crickettop5batting: Top5Edit,
  cricketupcoming: UpComingFixturesEdit,
  cricketresultsingle: WeekendResultsEdit,
};
```

### 3. Data Fetching Process

**Flow:**

```
Edit Portal Component
  ↓ (onMounted)
useFetchFixturaAsset().fetchAssetData()
  ↓
1. Check if selectedFixturaAsset exists in store
  ↓ (if not, fetch from API)
2. rendersStore.fetchAssetsByRenderAction()
  ↓
3. Extract assetLinkID from selectedFixturaAsset
  ↓
4. downloadsStore.fetchAssetByLinkID(assetLinkID)
  ↓
5. accountStore.fetchAccountMediaLibraryAction()
  ↓
6. Return dataObj from getDownloadData.value?.dataObj
```

**Key Composable: `useFetchFixturaAsset.js`**

- Fetches asset data from route query params if not in store
- Extracts `assetLinkID` from `selectedFixturaAsset`
- Fetches download data using `fetchAssetByLinkID`
- Returns `dataObj` containing the asset's editable data

**Data Structure:**

```typescript
dataObj = {
  DATA: [...],           // Array of fixtures/players/etc
  VIDEOMETA: {...},      // Video metadata
  // ... other asset-specific fields
}
```

### 4. Editing Process

**Edit Portal Components:**

1. Load `dataObj` on mount
2. Extract `DATA` array into local reactive ref
3. Allow user to edit individual items
4. Support drag-and-drop reordering (WeekendResultsEdit, Top5Edit, UpComingFixturesEdit)
5. Update local ref as user makes changes
6. Save changes back to `dataObj` and persist to CMS

**Save Process:**

```javascript
// Save function in edit portals
function saveAllChanges() {
  dataObj.value.DATA = [...localData.value];
  saveToCMS(); // Calls useSaveFixturaAsset().saveToCMS()
}
```

### 5. Save to CMS

**`useSaveFixturaAsset.js`:**

- Deep merges changes using lodash `_.merge()`
- Updates `dataObj` in store
- Calls `downloadsStore.saveFixturaAsset(downloadId, dataObj)`
- API endpoint: `PUT /downloads/{downloadId}` with:
  ```javascript
  {
    data: {
      OBJ: updatedData,
      hasError: false,
      forceRerender: false,
      hasBeenEdited: true,
      editTrigger: true,
    }
  }
  ```

---

## Current State

### ✅ What Works

1. **Edit Page Structure**

   - Main edit page (`processEdit.vue`) correctly routes to asset-specific edit components
   - Asset type detection and mapping works correctly
   - Responsive design (blocks on mobile)

2. **Edit Portal Components**

   - All 4 edit portal components exist and follow consistent patterns
   - Drag-and-drop reordering works (using `vue3-smooth-dnd`)
   - Form elements are functional
   - Video metadata editing works

3. **Data Fetching (Partial)**

   - `useFetchFixturaAsset` can fetch from route query params
   - Store actions are properly implemented
   - API service layer exists

4. **Save Functionality**
   - Save composable properly merges and saves data
   - API endpoint is correctly configured

### ❌ What Doesn't Work

1. **Edit Buttons Disabled**

   - Edit buttons in `HeaderSection.vue` and `AssetController.vue` are commented out
   - Reason: Data fetching issues (TKT-2025-003)

2. **Data Fetching Issues**

   - `dataObj` not populating correctly in some scenarios
   - `selectedFixturaAsset` may not be available when navigating directly
   - `assetLinkID` extraction may fail if asset structure is unexpected

3. **Error Handling**

   - No user feedback when data fetch fails
   - No loading states in some components
   - Generic error messages

4. **Missing Features**
   - No validation feedback in form elements
   - No undo/redo functionality
   - No confirmation dialog for unsaved changes
   - No auto-save

---

## Issues Identified

### Issue 1: Data Fetching Race Condition

**Location:** `useFixturaAsset.js` (lines 26-78)

**Problem:**

- `selectedFixturaAsset` may not be populated when edit page loads
- `assetLinkID` extraction depends on `selectedFixturaAsset` having a specific structure
- If `selectedFixturaAsset` is empty or has unexpected structure, `assetLinkID` will be null

**Impact:**

- Edit portals show "No data available" message
- User cannot edit assets

**Root Cause:**

```javascript
const assetLinkID = computed(() =>
  selectedFixturaAsset.value
    ? Object.keys(selectedFixturaAsset.value)[0] // Assumes object with keys
    : null
);
```

If `selectedFixturaAsset.value` is:

- `{}` (empty object) → `assetLinkID = null`
- `null` or `undefined` → `assetLinkID = null`
- Array instead of object → `assetLinkID = null`

### Issue 2: Missing Loading States

**Location:** Multiple edit portal components

**Problem:**

- Some components show loading spinner, but logic may be inconsistent
- `isFetching` state may not properly reflect actual fetch status
- No loading state during save operations visible to user

**Impact:**

- User doesn't know if data is loading or failed
- Poor UX during async operations

### Issue 3: Error Handling Gaps

**Location:** `useFixturaAsset.js`, edit portal components

**Problem:**

- Errors are logged to console but not shown to user
- No error boundaries or fallback UI
- Generic "No data available" message doesn't explain why

**Impact:**

- User doesn't understand why edit page is empty
- No way to recover from errors

### Issue 4: Direct Navigation Support

**Location:** `processEdit.vue`, `useFixturaAsset.js`

**Problem:**

- Direct navigation to edit page via URL may fail if store isn't populated
- Route query params are used as fallback, but timing may be off

**Current Fix (TKT-2025-001):**

- Added route query param fetching in `useFixturaAsset.js`
- But may still have race conditions

### Issue 5: Data Structure Assumptions

**Location:** Edit portal components

**Problem:**

- Components assume `dataObj.value.DATA` exists
- No null checks before accessing nested properties
- May crash if data structure is unexpected

**Example:**

```javascript
// WeekendResultsEdit.vue (line 55)
if (dataObj.value && dataObj.value.DATA) {
  fixtures.value = [...dataObj.value.DATA];
}
// But what if dataObj.value.DATA is undefined?
```

---

## Component Details

### Edit Portal Components

#### 1. WeekendResultsEdit.vue

- **Purpose:** Edit weekend cricket results
- **Features:**
  - Drag-and-drop fixture reordering
  - Edit fixture results (scores, teams, dates)
  - Edit innings (batting/bowling performances)
  - Video metadata editing
- **Data Structure:** `dataObj.DATA` = array of fixture objects

#### 2. LadderEdit.vue

- **Purpose:** Edit ladder/standings (currently read-only)
- **Features:**
  - Video metadata editing only
  - Shows message that ladder cannot be altered
- **Data Structure:** `dataObj.VIDEOMETA` only

#### 3. Top5Edit.vue

- **Purpose:** Edit top 5 players (batting or bowling)
- **Features:**
  - Drag-and-drop player reordering
  - Edit player statistics
  - Video metadata editing
  - Special handling for association accounts
- **Data Structure:** `dataObj.DATA` = array of player objects

#### 4. UpComingFixturesEdit.vue

- **Purpose:** Edit upcoming fixtures
- **Features:**
  - Drag-and-drop fixture reordering
  - Edit fixture details (teams, dates, venues)
  - Video metadata editing
- **Data Structure:** `dataObj.DATA` = array of fixture objects

### Section Components

#### fixtureResultItem.vue

- Individual fixture editor with modals for:
  - Result editing (scores, teams, dates)
  - Home team innings (batting/bowling)
  - Away team innings (batting/bowling)

#### TopPlayerItem.vue

- Individual player editor with modal for editing player statistics

#### upcomingFixtureItem.vue

- Individual upcoming fixture editor

#### VideoMetaDataEdit.vue

- Edits video metadata (title, description, etc.)
- Fixed JSON parsing issue (TKT-2025-002)

---

## Store Integration

### Renders Store (`src/store/renders/`)

- **Action:** `fetchAssetsByRenderAction()`
  - Fetches assets by render ID, grouping category, and asset type
  - Sets `selectedFixturaAsset` in store
  - Used by `useFixturaAsset` when store is empty

### Downloads Store (`src/store/downloads/`)

- **Action:** `fetchAssetByLinkID(assetLinkID)`

  - Fetches full asset data by asset link ID
  - Sets `downloadData` in store
  - Returns `dataObj` via `getDownloadData.value?.dataObj`

- **Action:** `saveFixturaAsset(downloadId, updatedData)`
  - Saves edited data to CMS
  - Updates download record with edited flag

### Account Store (`src/store/account/`)

- **Action:** `fetchAccountMediaLibraryAction(accountId)`
  - Fetches media library for account
  - Used in edit flow for media selection

---

## API Endpoints

### Fetch Asset by Link ID

```
GET /download/asset-by-link/{assetLinkID}
```

Returns: `AssetData` with `dataObj` structure

### Fetch Assets by Render

```
GET /downloads?filters[render][id][$eq]={renderId}&...
```

Returns: Array of downloads filtered by render

### Save Asset

```
PUT /downloads/{downloadId}
Body: {
  data: {
    OBJ: updatedData,
    hasError: false,
    forceRerender: false,
    hasBeenEdited: true,
    editTrigger: true,
  }
}
```

---

## Recommendations

### High Priority

1. **Fix Data Fetching Issues (TKT-2025-003)**

   - Add proper null checks for `selectedFixturaAsset`
   - Improve `assetLinkID` extraction logic
   - Add retry mechanism for failed fetches
   - Ensure data is fully loaded before rendering edit portals

2. **Improve Error Handling**

   - Show user-friendly error messages
   - Add error boundaries
   - Provide recovery options (retry, go back)
   - Log errors for debugging

3. **Add Loading States**

   - Consistent loading indicators across all edit portals
   - Show progress during save operations
   - Disable buttons during async operations

4. **Re-enable Edit Buttons**
   - Once data fetching is fixed, uncomment edit buttons
   - Add proper conditional rendering
   - Test all navigation paths

### Medium Priority

5. **Validation Feedback**

   - Show validation errors in form elements
   - Disable save button if validation fails
   - Highlight invalid fields

6. **Unsaved Changes Warning**

   - Detect unsaved changes
   - Show confirmation dialog before navigation
   - Auto-save draft changes

7. **Data Structure Validation**
   - Validate `dataObj` structure on load
   - Provide fallback for unexpected structures
   - Better error messages for missing data

### Low Priority

8. **Undo/Redo Functionality**

   - Track edit history
   - Allow undo/redo operations
   - Keyboard shortcuts (Ctrl+Z, Ctrl+Y)

9. **Auto-save**

   - Save changes automatically after delay
   - Show save status indicator
   - Prevent data loss

10. **Preview Mode**

    - Preview changes before saving
    - Side-by-side comparison
    - Highlight differences

11. **Keyboard Shortcuts**
    - Save: Ctrl+S
    - Cancel: Esc
    - Navigation: Arrow keys

---

## Testing Recommendations

### Unit Tests

- Test `useFixturaAsset` with various data structures
- Test `useSaveFixturaAsset` merge logic
- Test asset type mapping
- Test validation functions

### Integration Tests

- Test navigation from asset view to edit page
- Test data fetching with empty store
- Test save operation end-to-end
- Test error scenarios

### E2E Tests

- Test complete edit flow for each asset type
- Test direct navigation to edit page
- Test drag-and-drop reordering
- Test save and verify changes persist

---

## Related Tickets

- **TKT-2025-001:** Fixed direct navigation and case sensitivity
- **TKT-2025-002:** Fixed JSON parsing error in VideoMetaDataEdit
- **TKT-2025-003:** Debug and fix data fetching issues (IN PROGRESS)

---

## Files Modified/Reviewed

### Core Edit Feature

- `src/pages/edit/processEdit.vue`
- `src/pages/edit/composables/useFixturaAsset.js`
- `src/pages/edit/composables/useSaveFixturaAsset.js`
- `src/pages/edit/components/HeaderSection.vue`

### Edit Portal Components

- `src/pages/edit/AssetEditPortals/WeekendResultsEdit.vue`
- `src/pages/edit/AssetEditPortals/LadderEdit.vue`
- `src/pages/edit/AssetEditPortals/Top5Edit.vue`
- `src/pages/edit/AssetEditPortals/UpComingFixturesEdit.vue`

### Section Components

- `src/pages/edit/AssetEditPortals/Sections/fixtureResultItem.vue`
- `src/pages/edit/AssetEditPortals/Sections/TopPlayerItem.vue`
- `src/pages/edit/AssetEditPortals/Sections/upcomingFixtureItem.vue`
- `src/pages/edit/AssetEditPortals/Sections/VideoMetaDataEdit.vue`

### Asset View Components (Edit Buttons)

- `src/pages/asset/components/HeaderSection.vue` (commented out)
- `src/pages/asset/components/AssetController.vue` (commented out)
- `src/pages/asset/assets/RosterPoster.vue` (active)

### Store Actions

- `src/store/downloads/actions.ts`
- `src/store/renders/actions.ts`
- `src/store/downloads/service.ts`

### Routing

- `src/router/accountRoutes.ts`

---

## Conclusion

The edit feature is well-architected and mostly functional, but currently disabled due to data fetching reliability issues. The main problems are:

1. **Data fetching race conditions** - `selectedFixturaAsset` may not be available when needed
2. **Error handling gaps** - Users don't get feedback when things fail
3. **Missing loading states** - Poor UX during async operations

Once these issues are resolved (TKT-2025-003), the edit buttons can be re-enabled and the feature will be fully functional. The codebase is well-structured with good separation of concerns, making it relatively straightforward to fix the identified issues.

---

## Next Steps

1. **Investigate data fetching issues** (TKT-2025-003)

   - Add logging to understand data flow
   - Test with various asset structures
   - Fix `assetLinkID` extraction logic

2. **Add error handling and loading states**

   - Implement consistent error UI
   - Add loading indicators
   - Improve user feedback

3. **Re-enable edit buttons**

   - Uncomment edit buttons
   - Test all navigation paths
   - Verify data loading works

4. **Add validation and UX improvements**
   - Form validation feedback
   - Unsaved changes warning
   - Better error messages
