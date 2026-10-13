# 01 — Apply Edits skips the rendering state

**Status:** needs-triage

**What is broken:** After an edit, on an asset route such as `/705/cricket/9079/senior/CricketTeamOfTheWeek`, **Apply Edits** sends the rerender request and the server accepts it. The page stays on the current video and images. It does not stay in a loading or rendering state, and it does not show the new asset when the job finishes.

**Where:** Edit save returns to the asset route from `TeamOfTheWeekEdit.vue` `saveChanges`. The asset page shows **Apply Edits** when `editTrigger` is set (`AssetImageGallery.vue`, `AssetVideo.vue`). That button calls `useAssetRerender` → `POST /download/ForceAssetRerender`. Team of the Week renders through `AssetDefaultView.vue`.

## Why the button does nothing

Confirmed on Apply Edits. `POST /download/ForceAssetRerender` returns:

```json
{ "success": true, "message": "Rerender triggered successfully", "error": null }
```

`fetcher.post` already unwraps the axios body, so that object is what `triggerRerender` receives. It only treats the call as a success when `response.data === true`. This body has no `data` field, so the store stores `success: false` and skips `trackPackRerun`. `useAssetRerender` only polls and refreshes when `rerenderResponse.success` is true, so the page never leaves the current video and images. `isRerendering` is cleared in `finally` as soon as the post returns, so the button loading state ends with the request.

## What still breaks after that check is fixed

Save writes `editTrigger: true` and `forceRerender: false`, then navigates back. The existing download is already `hasBeenProcessed: true`, so `useAssetState` keeps the gallery and video in `processed` and the old media stays on screen.

Polling then calls `GET /downloads/:id` and stops on the first `attributes.hasBeenProcessed === true`:

```52:54:src/pages/asset/assets/errors/composables/useRerender.ts
        if (asset && asset?.attributes.hasBeenProcessed) {
          return true;
        }
```

A Team of the Week asset is already processed, so the first read looks finished. `isPolling` flips on and off in the same turn, and the skeleton never stays up. The store already has `pollRerenderStatus` for `GET /download/rerender/status/:id`. The Apply Edits UI does not call it.

The poll then calls `fetchAssetsByRenderAction`, which sets the global renders `loading` flag. `AssetView.vue` swaps the page for a table spinner and unmounts the asset. The refetch still has the previous downloads, loading clears, and the same page comes back. Nothing is left polling when the job finishes.

`AssetDefaultView.vue` also takes the asset state once, from `videoAsset.value` and `imageAsset.value` at setup. A later in-place asset update does not move video or gallery into `rerendering`.

## Still to confirm

After **Apply Edits** on that route, what the first few `GET /download/rerender/status/:id` responses contain, and whether `GET /downloads/:id` keeps `hasBeenProcessed: true` for the whole job. If the status flag never goes false, completion has to be a different field (new URL, `updatedAt`, or `forceRerender`).

## Comments

Apply Edits now treats `{ success: true, message, error }` as a started rerender. The clicked video or gallery sets its own polling flag immediately, replaces that asset with a skeleton, and keeps it there until the download record changes. The page-level renders loader is not used for that refresh, so the skeleton is not unmounted by a full-page spinner.
