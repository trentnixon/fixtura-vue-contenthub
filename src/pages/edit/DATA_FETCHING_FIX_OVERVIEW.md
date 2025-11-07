# Data Fetching Fix Overview

## Problem Statement

When accessing the edit page via URL (e.g., `/429/edit/processEdit?accountid=429&sport=cricket&renderid=8564&groupingcategory=senior&asset=CricketResults`), the page displayed:

- **"No data available for the selected asset."**
- Console logs showed:
  - `[useFixturaAsset] Assets fetched: null`
  - `[useFixturaAsset] assetLinkID: null`
  - `[WeekendResultsEdit] dataObj loaded: undefined`

## Root Cause Analysis

### Issue 1: Incorrect `assetLinkID` Extraction Logic

**Location:** `src/pages/edit/composables/useFixturaAsset.js`

**Problem:**
The `assetLinkID` computed property was incorrectly assuming the API response structure was nested under an `assetType` key:

```javascript
// ❌ INCORRECT - Assumed nested structure
const assetLinkID = computed(() => {
  if (!selectedFixturaAsset.value) return null;
  // Was trying to access: selectedFixturaAsset.value[assetType][assetLinkID]
  // But this structure doesn't exist!
});
```

**Actual API Response Structure:**

```javascript
{
  "cbef93e47137e06ef0f93c46014c4ccd2a57590fc33c16bc7e801a74bd67357d": {
    downloads: [...],
    aiArticles: [...]
  }
}
```

The `assetLinkID` is the **top-level key** of the object, not nested under an `assetType`.

### Issue 2: Missing Route Query Parameter Fetching

**Location:** `src/pages/edit/composables/useFixturaAsset.js`

**Problem:**
The composable wasn't fetching asset data from route query parameters when `selectedFixturaAsset` was empty. This meant direct navigation to edit URLs failed because the store wasn't populated.

### Issue 3: Case Sensitivity in Data Structure Access

**Location:** `src/pages/edit/AssetEditPortals/WeekendResultsEdit.vue`

**Problem:**
The component was only checking for uppercase field names (`DATA`, `VIDEOMETA`) but the API sometimes returned lowercase (`data`, `videoMeta`), causing data to not be found.

## Solution Implementation

### Fix 1: Corrected `assetLinkID` Extraction

**File:** `src/pages/edit/composables/useFixturaAsset.js`

**Changes:**

```javascript
// ✅ CORRECT - Extract first key directly
const assetLinkID = computed(() => {
  if (!selectedFixturaAsset.value) return null;

  // The API returns assetLinkID directly as the first key
  // Structure: { "cbef93e4...": { downloads: [], aiArticles: [] } }
  const keys = Object.keys(selectedFixturaAsset.value);

  if (keys.length === 0) {
    console.warn(
      "[useFixturaAsset] selectedFixturaAsset is empty:",
      selectedFixturaAsset.value
    );
    return null;
  }

  // Get the first key, which is the assetLinkID
  const linkID = keys[0];
  console.log("[useFixturaAsset] Extracted assetLinkID:", linkID);

  return linkID;
});
```

**Key Changes:**

- Extract the first key from `selectedFixturaAsset.value` directly
- Added validation to check if keys exist
- Added console logging for debugging

### Fix 2: Added Route Query Parameter Fetching

**File:** `src/pages/edit/composables/useFixturaAsset.js`

**Changes:**

```javascript
async function fetchAssetData() {
  isFetching.value = true;

  try {
    // First, ensure selectedFixturaAsset is populated from route query params
    const needsFetch =
      !selectedFixturaAsset.value ||
      Object.keys(selectedFixturaAsset.value).length === 0;

    if (
      needsFetch &&
      route.query.accountid &&
      route.query.renderid &&
      route.query.groupingcategory &&
      route.query.asset
    ) {
      console.log("[useFixturaAsset] Fetching assets from render...", {
        accountid: route.query.accountid,
        renderid: route.query.renderid,
        groupingcategory: route.query.groupingcategory,
        asset: route.query.asset,
      });
      await rendersStore.fetchAssetsByRenderAction(
        Number(route.query.accountid),
        Number(route.query.renderid),
        route.query.groupingcategory,
        route.query.asset // Pass the asset name as-is from URL
      );
      console.log(
        "[useFixturaAsset] Assets fetched:",
        selectedFixturaAsset.value
      );
    }

    // Then fetch the download data using assetLinkID
    if (assetLinkID.value) {
      await downloadsStore.fetchAssetByLinkID(assetLinkID.value);
      await accountStore.fetchAccountMediaLibraryAction(route.query.accountid);
    }
  } catch (error) {
    console.error("[useFixturaAsset] Error fetching asset data:", error);
  } finally {
    isFetching.value = false;
  }
}
```

**Key Changes:**

- Check if `selectedFixturaAsset` is empty before fetching
- Fetch from route query parameters if needed
- Pass asset name as-is from URL (no transformation)
- Added comprehensive logging for debugging

### Fix 3: Added Case-Insensitive Data Access

**File:** `src/pages/edit/AssetEditPortals/WeekendResultsEdit.vue`

**Changes:**

```javascript
// Handle both uppercase (DATA) and lowercase (data) field names
const fixturesData = dataObj.value?.data || dataObj.value?.DATA;
if (fixturesData && Array.isArray(fixturesData)) {
  fixtures.value = [...fixturesData];
}
```

**Also Updated:**

- `saveFixture()` and `saveAllChanges()` functions
- `updateVideoMeta()` function

**Key Changes:**

- Check for both uppercase and lowercase field names
- Support backward compatibility with existing data structures
- Handle both `videoMeta` and `VIDEOMETA` variations

## Data Flow After Fix

```
1. User navigates to: /429/edit/processEdit?accountid=429&sport=cricket&renderid=8564&groupingcategory=senior&asset=CricketResults

2. processEdit.vue loads and calls WeekendResultsEdit.vue

3. WeekendResultsEdit.vue calls useFetchFixturaAsset().fetchAssetData()

4. fetchAssetData() checks if selectedFixturaAsset is empty
   ├─ If empty AND route query params exist:
   │  └─ Calls rendersStore.fetchAssetsByRenderAction()
   │     └─ API: /render/fixturaGetAssetsFromRender/{userID}/{renderID}/{category}/{asset}
   │        └─ Returns: { "assetLinkID": { downloads: [], aiArticles: [] } }
   │
   └─ selectedFixturaAsset is now populated

5. assetLinkID computed property extracts the first key
   └─ Returns: "cbef93e47137e06ef0f93c46014c4ccd2a57590fc33c16bc7e801a74bd67357d"

6. fetchAssetData() uses assetLinkID to fetch download data
   └─ Calls downloadsStore.fetchAssetByLinkID(assetLinkID)
      └─ API: /downloads/getFixturaAsset/{assetLinkID}
         └─ Returns: { downloads: [], aiArticles: [], dataObj: { ... } }

7. dataObj is now available via getDownloadData.value?.dataObj

8. WeekendResultsEdit.vue accesses data:
   ├─ Checks: dataObj.value?.data || dataObj.value?.DATA
   └─ Loads fixtures into fixtures.value array

9. Component renders with data ✅
```

## Testing & Verification

### Before Fix:

- ❌ Page showed "No data available for the selected asset"
- ❌ Console: `assetLinkID: null`
- ❌ Console: `dataObj loaded: undefined`

### After Fix:

- ✅ Page loads and displays fixture data
- ✅ Console: `Extracted assetLinkID: cbef93e4...`
- ✅ Console: `dataObj loaded: { data: [...], videoMeta: {...} }`
- ✅ All form fields populate correctly
- ✅ Video metadata displays correctly

## Related Files Modified

1. **src/pages/edit/composables/useFixturaAsset.js**

   - Fixed `assetLinkID` extraction logic
   - Added route query parameter fetching
   - Added comprehensive logging

2. **src/pages/edit/AssetEditPortals/WeekendResultsEdit.vue**

   - Added case-insensitive data access
   - Support for both `data`/`DATA` and `videoMeta`/`VIDEOMETA`

3. **src/store/renders/actions.ts**

   - Added logging for API calls and responses

4. **src/store/renders/service.ts**
   - Added logging for API URL construction and responses

## Key Takeaways

1. **Always verify API response structure** - Don't assume nested structures without checking the actual response
2. **Support case variations** - APIs may return different casing, handle both
3. **Add comprehensive logging** - Helps debug data flow issues quickly
4. **Handle route query parameters** - Direct navigation should work without requiring store pre-population
5. **Validate data at each step** - Check for empty objects, null values, and missing keys

## Related Tickets

- **TKT-2025-001**: Fixed direct navigation to edit page
- **TKT-2025-002**: Fixed JSON parsing errors in VideoMetaDataEdit
- **TKT-2025-003**: Fixed input field value persistence issues
