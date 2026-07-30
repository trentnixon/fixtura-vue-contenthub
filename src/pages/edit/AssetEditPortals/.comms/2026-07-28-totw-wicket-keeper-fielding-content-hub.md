# TOTW Wicket-Keeper Update — Content Hub → Remotion Handoff

**Date:** 2026-07-29 (updated)  
**From:** Content Hub (Vue edit portal)  
**Related:** [TOTW category/position contract](./2026-07-28-totw-category-types-remotion.md)

---

## Summary

Content Hub now saves **Wicket-Keeper** as a first-class category in CMS, with a dedicated position slug and **fielding-only** stats. This is a change from our earlier interim approach (remapping keepers to `Batter`).

**Action needed from Remotion:** Add render support for the new category, position slug, and `fielding` stat block — or confirm how you want these rows handled until support ships.

---

## What changed (2026-07-29)

| Before (interim) | Now (Content Hub) |
|------------------|-------------------|
| WK remapped to `Batter` on save | WK saved as `Wicket-Keeper` |
| Position: `higheststrikerate` or `topscorer` | Fixed position: `wicketKeeper` |
| Batting stats in edit form | **No batting stats** — fielding only |
| Sub-category dropdown for WK | **No sub-category** for WK |
| `fielding` optional / metadata | `fielding` **required** on save |

---

## CMS payload (authoritative)

When a user saves a wicket-keeper:

```json
{
  "category": "Wicket-Keeper",
  "categoryDetail": {
    "type": "Wicket-Keeper",
    "position": "wicketKeeper"
  },
  "player": "siobhan watts",
  "primaryTeam": "Tracy Village Div 2",
  "club": {
    "name": "Tracy Village Div 2",
    "logo": { "url": "...", "width": 800, "height": 800 }
  },
  "fielding": {
    "catches": 0,
    "stumpings": 4
  },
  "rank": 25,
  "rankings": {},
  "prompt": "..."
}
```

### Rules Content Hub enforces on save

- `category` and `categoryDetail.type` = `"Wicket-Keeper"`
- `categoryDetail.position` = `"wicketKeeper"` (always — not user-selectable)
- `fielding.catches` and `fielding.stumpings` included (defaults to `0` if empty)
- `batting`, `bowling`, and `allRounder` blocks **removed** from payload

---

## Fielding schema

| Field | Type | Path |
|-------|------|------|
| Catches | number | `fielding.catches` |
| Stumpings | number | `fielding.stumpings` |

Nested under `fielding` only — no top-level `catches` / `stumpings` keys.

---

## Position slug: `wicketKeeper`

Added to the Content Hub position slug set:

| Slug | Label (edit UI) | Category |
|------|-----------------|----------|
| `wicketKeeper` | Wicket Keeper | Wicket-Keeper only |

Wicket-keepers have **no sub-category dropdown** — the slug is fixed. Other categories still use sub-category slugs with human-readable labels:

| Slug | Label |
|------|-------|
| `topscorer` | Top Scorer |
| `higheststrikerate` | Highest Strike Rate |
| `mostwickets` | Most Wickets |
| `besteconomy` | Best Economy |
| `topallrounder` | Top All-Rounder |
| `bestoftherest` | Best of the Rest |

---

## Edit UI behaviour

- Category dropdown includes **Wicket-Keeper**
- Stat fields: **Catches**, **Stumpings** only
- No sub-category select (unlike Batter, Bowler, etc.)
- Squad list summary shows e.g. `0 Catches / 4 St`

---

## Remotion impact (current vs needed)

Based on your earlier contract response, Remotion **today** does not handle this payload:

| CMS field | Remotion today | Needed |
|-----------|----------------|--------|
| `category: "Wicket-Keeper"` | Not supported | Accept as 5th category |
| `position: "wicketKeeper"` | Not in `positionToIconMap` | Map to keeper icon |
| `fielding.catches` / `fielding.stumpings` | Not read | Display in stat line |
| `batting` on WK rows | N/A — not sent | — |

Until Remotion support ships, WK rows may not render correctly (or at all). Content Hub will continue saving this shape.

---

## Suggested Remotion implementation

1. **Add to `positionToIconMap`:**
   ```ts
   wicketKeeper: "WicketKeeper" // or appropriate icon key
   ```

2. **Stat display branch** (alongside batting/bowling in `row-Classic.tsx`):
   ```tsx
   {player.categoryDetail.position === "wicketKeeper" && player.fielding && (
     <FieldingStatDisplay fielding={player.fielding} />
   )}
   ```

3. **Category enum** — add `"Wicket-Keeper"` to `types.ts` if category is used for grouping.

4. **Position ↔ category invariant:**
   ```
   wicketKeeper → Wicket-Keeper
   ```

---

## Migration note

Existing CMS rows saved before this update may have:

- `category: "Wicket-Keeper"` with `batting` block (legacy test data)
- WK remapped to `Batter` + `higheststrikerate` (interim Content Hub behaviour)

On re-save through Content Hub, these normalize to the new shape above.

---

## Questions for Remotion

1. Confirm `wicketKeeper` as the position slug (camelCase) — or prefer `wicket-keeper` / `wicketkeeper`?
2. Fielding-only display, or batting + fielding combined row?
3. Timeline for render support — should Content Hub hold off pushing WK saves to production until Remotion is ready?
4. Any changes to the `fielding` schema before you implement?

---

## Content Hub reference files

- Types: `src/types/TeamOfTheWeek.ts`
- Logic: `src/pages/edit/composables/useTotwPlayerStats.ts` — `serializeTotwPlayerForCms`, `TOTW_POSITION_LABELS`
- Form: `src/pages/edit/AssetEditPortals/Sections/TeamOfTheWeekPlayerForm.vue`
