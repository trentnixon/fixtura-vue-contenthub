# TOTW Category & Position Contract — Remotion ↔ Content Hub

**Date:** 2026-07-28  
**Status:** Confirmed by Remotion team  
**Content Hub:** Aligned in `useTotwPlayerStats.ts`

---

## Key rule

**`categoryDetail.position` drives icon + stat lines in the video.**  
`category` alone does not control the card template.

A `Bowler` with `position: "topscorer"` renders as a batter.

---

## Remotion categories (4 only)

| `category` / `categoryDetail.type` |
|------------------------------------|
| `Batter` |
| `Bowler` |
| `All-Rounder` |
| `Twelfth Man` |

**No `Wicket-Keeper` in Remotion.** Content Hub maps WK → `Batter` on CMS save.

---

## Position slugs

| Position | Category | Icon | Stats shown |
|----------|----------|------|-------------|
| `topscorer` | Batter | Batter1 | Batting |
| `higheststrikerate` | Batter | Batter2 | Batting |
| `mostwickets` | Bowler | Bowler1 | Bowling |
| `besteconomy` | Bowler | Bowler2 | Bowling |
| `topallrounder` | All-Rounder | AllRounder | Batting + bowling |
| `bestoftherest` | Twelfth Man | 12th Man | Available stats |

Positions are achievement labels — duplicates allowed in production.

---

## Stat blocks

| Category | Required | Notes |
|----------|----------|-------|
| Batter | `batting` | |
| Bowler | `bowling` | Omit empty `batting` on save |
| All-Rounder | `batting`, `bowling`, `allRounder` | Position must be `topallrounder` |
| Twelfth Man | — | Optional batting/bowling |
| Wicket-Keeper (edit UI) | `batting` only | Saves as `Batter`; `fielding` stored but not rendered |

---

## Content Hub behaviour

### Edit UI categories
`Batter`, `Bowler`, `All-Rounder`, `Wicket-Keeper`, `Twelfth Man`

### On save (`serializeTotwPlayerForCms`)
1. Map `Wicket-Keeper` → `category: "Batter"`, `type: "Batter"`
2. Validate position matches category (reset to default if invalid)
3. Strip irrelevant stat blocks (e.g. `batting` on bowlers)
4. Preserve `fielding` in CMS if present (Remotion ignores today)

### Default positions
```ts
Batter: "topscorer"
Bowler: "mostwickets"
All-Rounder: "topallrounder"
Wicket-Keeper: "higheststrikerate" → saves as Batter
Twelfth Man: "bestoftherest"
```

### On category change
Atomically updates `category`, `categoryDetail.type`, `categoryDetail.position`, and stat blocks.

---

## Other fields

| Field | Remotion usage |
|-------|----------------|
| `rank` | Metadata only — not used for order or labels |
| `data[]` order | Display order |
| `fielding` | Not read — safe to store in CMS |
| `categoryDetail.type` | Not read for rendering — must mirror `category` |

---

## Reference squad (12 players)

| Category | Count |
|----------|-------|
| Batter | 5 |
| All-Rounder | 2 |
| Bowler | 4 |
| Twelfth Man | 1 |

Not enforced by renderer — accepts any non-empty `data[]`.

---

## Original issue (resolved)

**test** (`Bowler` + `topscorer`) → rendered as batter.  
**Fix:** Position dropdown + category change resets position + CMS serialize validation.

**siobhan watts** (`Wicket-Keeper`) → unsupported category in Remotion.  
**Update (2026-07-29):** Content Hub now saves WK natively — see [Wicket-Keeper handoff](./2026-07-28-totw-wicket-keeper-fielding-content-hub.md).

---

## Wicket-Keeper update (2026-07-29)

Content Hub now saves keepers as:

- `category: "Wicket-Keeper"`
- `position: "wicketKeeper"`
- `fielding: { catches, stumpings }` only — no batting block

Remotion render support still required. Full handoff: [2026-07-28-totw-wicket-keeper-fielding-content-hub.md](./2026-07-28-totw-wicket-keeper-fielding-content-hub.md)
