import type {
  TotwEditCategory,
  TotwPlayer,
  TotwPositionOption,
  TotwPositionSlug,
  TotwRemotionCategory,
} from "@/types/TeamOfTheWeek";
import {
  TOTW_MAX_BATTERS,
  TOTW_MAX_BOWLERS,
  TOTW_MAX_SQUAD_SIZE,
  TOTW_MIN_SQUAD_SIZE,
} from "@/types/TeamOfTheWeek";

export {
  TOTW_MAX_SQUAD_SIZE,
  TOTW_MIN_SQUAD_SIZE,
  TOTW_MAX_BATTERS,
  TOTW_MAX_BOWLERS,
};

export type { TotwPositionOption };

export const TOTW_CATEGORY_OPTIONS: TotwEditCategory[] = [
  "Batter",
  "Bowler",
  "All-Rounder",
  "Wicket-Keeper",
  "Twelfth Man",
];

export const TOTW_POSITION_LABELS: Record<TotwPositionSlug, string> = {
  topscorer: "Top Scorer",
  higheststrikerate: "Highest Strike Rate",
  mostwickets: "Most Wickets",
  besteconomy: "Best Economy",
  topallrounder: "Top All-Rounder",
  bestoftherest: "Best of the Rest",
  wicketKeeper: "Wicket Keeper",
};

export const TOTW_POSITIONS_BY_CATEGORY: Record<
  TotwRemotionCategory,
  TotwPositionSlug[]
> = {
  Batter: ["topscorer", "higheststrikerate"],
  Bowler: ["mostwickets", "besteconomy"],
  "All-Rounder": ["topallrounder"],
  "Twelfth Man": ["bestoftherest"],
};

/** Default position slug when category changes */
export const TOTW_DEFAULT_CATEGORY_POSITIONS: Record<
  TotwEditCategory,
  TotwPositionSlug
> = {
  Batter: "topscorer",
  Bowler: "mostwickets",
  "All-Rounder": "topallrounder",
  "Wicket-Keeper": "wicketKeeper",
  "Twelfth Man": "bestoftherest",
};

const DEFAULT_BATTING: NonNullable<TotwPlayer["batting"]> = {
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
  strikeRate: 0,
  notOut: false,
};

const DEFAULT_BOWLING: NonNullable<TotwPlayer["bowling"]> = {
  wickets: 0,
  overs: 0,
  maidens: 0,
  runs: 0,
  economy: 0,
};

const DEFAULT_ALL_ROUNDER: NonNullable<TotwPlayer["allRounder"]> = {
  score: 0,
  formula: "runs × wickets",
  battingContribution: 0,
  bowlingContribution: 0,
};

const DEFAULT_FIELDING: NonNullable<TotwPlayer["fielding"]> = {
  catches: 0,
  stumpings: 0,
};

const CMS_CATEGORY_ALIASES: Record<string, TotwEditCategory> = {
  batter: "Batter",
  batsman: "Batter",
  batting: "Batter",
  bowler: "Bowler",
  bowling: "Bowler",
  "all-rounder": "All-Rounder",
  allrounder: "All-Rounder",
  "all rounder": "All-Rounder",
  "wicket-keeper": "Wicket-Keeper",
  wicketkeeper: "Wicket-Keeper",
  "wicket keeper": "Wicket-Keeper",
  keeper: "Wicket-Keeper",
  "twelfth man": "Twelfth Man",
  twelfthman: "Twelfth Man",
  "12th man": "Twelfth Man",
};

export interface TotwStatFieldConfig {
  path: string;
  label: string;
  inputType: "number" | "decimal" | "select" | "text";
  maxLength?: number;
  selectItems?: string[];
}

const BATTING_FIELDS: TotwStatFieldConfig[] = [
  {
    path: "batting.runs",
    label: "Runs Scored",
    inputType: "number",
    maxLength: 3,
  },
  {
    path: "batting.balls",
    label: "Balls Faced",
    inputType: "number",
    maxLength: 3,
  },
  {
    path: "batting.fours",
    label: "Fours",
    inputType: "number",
    maxLength: 2,
  },
  {
    path: "batting.sixes",
    label: "Sixes",
    inputType: "number",
    maxLength: 2,
  },
  {
    path: "batting.strikeRate",
    label: "Strike Rate",
    inputType: "decimal",
    maxLength: 6,
  },
  {
    path: "batting.notOut",
    label: "Not Out",
    inputType: "select",
    selectItems: ["Yes", "No"],
  },
];

const BOWLING_FIELDS: TotwStatFieldConfig[] = [
  {
    path: "bowling.wickets",
    label: "Wickets",
    inputType: "number",
    maxLength: 2,
  },
  {
    path: "bowling.overs",
    label: "Overs Bowled",
    inputType: "number",
    maxLength: 4,
  },
  {
    path: "bowling.maidens",
    label: "Maidens",
    inputType: "number",
    maxLength: 2,
  },
  {
    path: "bowling.runs",
    label: "Runs Conceded",
    inputType: "number",
    maxLength: 3,
  },
  {
    path: "bowling.economy",
    label: "Economy Rate",
    inputType: "decimal",
    maxLength: 6,
  },
];

const FIELDING_FIELDS: TotwStatFieldConfig[] = [
  {
    path: "fielding.catches",
    label: "Catches",
    inputType: "number",
    maxLength: 2,
  },
  {
    path: "fielding.stumpings",
    label: "Stumpings",
    inputType: "number",
    maxLength: 2,
  },
];

const ALL_ROUNDER_META_FIELDS: TotwStatFieldConfig[] = [
  {
    path: "allRounder.score",
    label: "All-Rounder Score",
    inputType: "number",
    maxLength: 6,
  },
  {
    path: "allRounder.formula",
    label: "Formula",
    inputType: "text",
    maxLength: 40,
  },
  {
    path: "allRounder.battingContribution",
    label: "Batting Contribution",
    inputType: "number",
    maxLength: 6,
  },
  {
    path: "allRounder.bowlingContribution",
    label: "Bowling Contribution",
    inputType: "number",
    maxLength: 6,
  },
];

export function getDefaultCategoryPosition(
  category: TotwEditCategory
): TotwPositionSlug {
  return TOTW_DEFAULT_CATEGORY_POSITIONS[category];
}

export function getPositionLabel(slug: string | undefined): string {
  if (!slug) return "";
  return TOTW_POSITION_LABELS[slug as TotwPositionSlug] ?? slug;
}

export function getPositionOptionsForCategory(
  category: TotwEditCategory
): TotwPositionSlug[] {
  if (category === "Wicket-Keeper") {
    return [];
  }

  return TOTW_POSITIONS_BY_CATEGORY[category as TotwRemotionCategory] ?? [];
}

export function getPositionSelectItemsForCategory(
  category: TotwEditCategory
): TotwPositionOption[] {
  return getPositionOptionsForCategory(category).map((slug) => ({
    label: TOTW_POSITION_LABELS[slug],
    value: slug,
  }));
}

export function showPositionSelectForCategory(category: TotwEditCategory): boolean {
  return category !== "Wicket-Keeper";
}

export function isValidPositionForRemotionCategory(
  category: TotwRemotionCategory,
  position: string
): boolean {
  return TOTW_POSITIONS_BY_CATEGORY[category].includes(
    position as TotwPositionSlug
  );
}

export function resolveRemotionCategory(
  editCategory: TotwEditCategory
): TotwRemotionCategory | "Wicket-Keeper" {
  return editCategory;
}

/**
 * Apply category change including categoryDetail.position and relevant stat blocks.
 * Remotion routes icon/stats from categoryDetail.position — must stay in sync.
 */
export function applyTotwCategoryToPlayer(
  player: TotwPlayer,
  category: TotwEditCategory
): TotwPlayer {
  const updated: TotwPlayer = {
    ...player,
    category,
    categoryDetail: {
      type: category,
      position: getDefaultCategoryPosition(category),
    },
  };

  delete updated.batting;
  delete updated.bowling;
  delete updated.allRounder;
  delete updated.fielding;

  if (category === "Bowler") {
    updated.bowling = { ...DEFAULT_BOWLING, ...player.bowling };
  } else if (category === "All-Rounder") {
    updated.batting = { ...DEFAULT_BATTING, ...player.batting };
    updated.bowling = { ...DEFAULT_BOWLING, ...player.bowling };
    updated.allRounder = { ...DEFAULT_ALL_ROUNDER, ...player.allRounder };
  } else if (category === "Wicket-Keeper") {
    updated.fielding = { ...DEFAULT_FIELDING, ...player.fielding };
  } else {
    updated.batting = { ...DEFAULT_BATTING, ...player.batting };
  }

  return normalizeTotwPlayerForEdit(updated);
}

export function normalizeTotwCategory(
  raw: unknown
): TotwEditCategory | undefined {
  if (typeof raw !== "string" || !raw.trim()) return undefined;

  const trimmed = raw.trim();
  if (TOTW_CATEGORY_OPTIONS.includes(trimmed as TotwEditCategory)) {
    return trimmed as TotwEditCategory;
  }

  return CMS_CATEGORY_ALIASES[trimmed.toLowerCase()];
}

export function resolveTotwEditCategory(player: TotwPlayer): TotwEditCategory {
  const fromCategory = normalizeTotwCategory(player.category);
  if (fromCategory) return fromCategory;

  const fromDetail = normalizeTotwCategory(player.categoryDetail?.type);
  if (fromDetail) return fromDetail;

  const position = player.categoryDetail?.position;
  if (position === "wicketKeeper") {
    return "Wicket-Keeper";
  }
  if (position === "mostwickets" || position === "besteconomy") {
    return "Bowler";
  }
  if (position === "topallrounder") {
    return "All-Rounder";
  }
  if (position === "bestoftherest") {
    return "Twelfth Man";
  }

  if (player.bowling && !player.batting) return "Bowler";
  return "Batter";
}

/** @deprecated Use resolveTotwEditCategory */
export function resolveTotwCategory(player: TotwPlayer): TotwEditCategory {
  return resolveTotwEditCategory(player);
}

export function getStatFieldsForCategory(
  category: TotwEditCategory
): TotwStatFieldConfig[] {
  if (category === "Bowler") {
    return BOWLING_FIELDS;
  }
  if (category === "All-Rounder") {
    return [...BATTING_FIELDS, ...BOWLING_FIELDS, ...ALL_ROUNDER_META_FIELDS];
  }
  if (category === "Wicket-Keeper") {
    return FIELDING_FIELDS;
  }
  return BATTING_FIELDS;
}

export function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function getPrimaryStatLabel(player: TotwPlayer): string {
  const category = resolveTotwEditCategory(player);

  if (category === "Bowler") {
    return `${player.bowling?.wickets ?? 0} Wickets`;
  }

  if (category === "All-Rounder") {
    return `${player.batting?.runs ?? 0} Runs / ${player.bowling?.wickets ?? 0} Wkts`;
  }

  if (category === "Wicket-Keeper") {
    return `${player.fielding?.catches ?? 0} Catches / ${player.fielding?.stumpings ?? 0} St`;
  }

  return `${player.batting?.runs ?? 0} Runs`;
}

function isBattingSideCategory(category: TotwEditCategory): boolean {
  return (
    category === "Batter" ||
    category === "Wicket-Keeper" ||
    category === "All-Rounder"
  );
}

export function getPlayerDisplayName(player: TotwPlayer): string {
  return player.player || "Unknown Player";
}

/** Load CMS payload into edit state (preserves Wicket-Keeper in UI) */
export function normalizeTotwPlayerForEdit(player: TotwPlayer): TotwPlayer {
  const category = resolveTotwEditCategory(player);
  const position =
    category === "Wicket-Keeper"
      ? "wicketKeeper"
      : player.categoryDetail?.position || getDefaultCategoryPosition(category);

  return {
    ...player,
    category,
    categoryDetail: {
      type: category,
      position,
    },
    batting: player.batting ? { ...player.batting } : undefined,
    bowling: player.bowling ? { ...player.bowling } : undefined,
    allRounder: player.allRounder ? { ...player.allRounder } : undefined,
    fielding: player.fielding ? { ...player.fielding } : undefined,
  };
}

/** @deprecated Use normalizeTotwPlayerForEdit */
export function normalizeTotwPlayer(player: TotwPlayer): TotwPlayer {
  return normalizeTotwPlayerForEdit(player);
}

/** Prepare player for CMS save — Remotion-compatible shape */
export function serializeTotwPlayerForCms(player: TotwPlayer): TotwPlayer {
  const editCategory = resolveTotwEditCategory(player);

  if (editCategory === "Wicket-Keeper") {
    const serialized: TotwPlayer = {
      ...player,
      category: "Wicket-Keeper",
      categoryDetail: {
        type: "Wicket-Keeper",
        position: "wicketKeeper",
      },
      fielding: player.fielding ?? { ...DEFAULT_FIELDING },
    };
    delete serialized.batting;
    delete serialized.bowling;
    delete serialized.allRounder;
    return serialized;
  }

  const remotionCategory = editCategory as TotwRemotionCategory;

  let position =
    (player.categoryDetail?.position as TotwPositionSlug | undefined) ||
    getDefaultCategoryPosition(editCategory);

  if (!isValidPositionForRemotionCategory(remotionCategory, position)) {
    position = getDefaultCategoryPosition(editCategory);
  }

  const serialized: TotwPlayer = {
    ...player,
    category: remotionCategory,
    categoryDetail: {
      type: remotionCategory,
      position,
    },
  };

  if (remotionCategory === "Bowler") {
    delete serialized.batting;
    delete serialized.allRounder;
  } else if (remotionCategory === "Batter") {
    delete serialized.bowling;
    delete serialized.allRounder;
  } else if (remotionCategory === "All-Rounder") {
    serialized.batting = serialized.batting ?? { ...DEFAULT_BATTING };
    serialized.bowling = serialized.bowling ?? { ...DEFAULT_BOWLING };
    serialized.allRounder = serialized.allRounder ?? { ...DEFAULT_ALL_ROUNDER };
  } else if (remotionCategory === "Twelfth Man") {
    delete serialized.allRounder;
  }

  return serialized;
}

export function getCategoryPositionLabel(player: TotwPlayer): string {
  const category = resolveTotwEditCategory(player);
  if (category === "Wicket-Keeper") {
    return category;
  }
  const position = player.categoryDetail?.position;
  const positionLabel = getPositionLabel(position);
  return positionLabel ? `${category} — ${positionLabel}` : category;
}

export function countByCategory(players: TotwPlayer[]) {
  let batters = 0;
  let bowlers = 0;
  let twelfth = 0;

  for (const player of players) {
    const category = resolveTotwEditCategory(player);
    if (isBattingSideCategory(category)) batters++;
    else if (category === "Bowler") bowlers++;
    else if (category === "Twelfth Man") twelfth++;
  }

  return { batters, bowlers, twelfth };
}

export function canAddTotwPlayer(players: TotwPlayer[]): boolean {
  return players.length < TOTW_MAX_SQUAD_SIZE;
}

export function canRemoveTotwPlayer(players: TotwPlayer[]): boolean {
  return players.length > 0;
}

export function createDefaultTotwPlayer(players: TotwPlayer[]): TotwPlayer {
  const { batters, bowlers } = countByCategory(players);

  if (batters < TOTW_MAX_BATTERS) {
    return normalizeTotwPlayerForEdit({
      category: "Batter",
      categoryDetail: {
        type: "Batter",
        position: getDefaultCategoryPosition("Batter"),
      },
      rank: batters + 1,
      player: "",
      primaryTeam: "",
      batting: { ...DEFAULT_BATTING },
      rankings: {},
      prompt: "",
    });
  }

  if (bowlers < TOTW_MAX_BOWLERS) {
    return normalizeTotwPlayerForEdit({
      category: "Bowler",
      categoryDetail: {
        type: "Bowler",
        position: getDefaultCategoryPosition("Bowler"),
      },
      rank: bowlers + 1,
      player: "",
      primaryTeam: "",
      bowling: { ...DEFAULT_BOWLING },
      rankings: {},
      prompt: "",
    });
  }

  return normalizeTotwPlayerForEdit({
    category: "Twelfth Man",
    categoryDetail: {
      type: "Twelfth Man",
      position: getDefaultCategoryPosition("Twelfth Man"),
    },
    rank: 1,
    player: "",
    primaryTeam: "",
    batting: { ...DEFAULT_BATTING },
    rankings: {},
    prompt: "",
  });
}

export function getSquadStatusMessage(count: number): string | null {
  if (count === 0) {
    return "No players in the squad. Add players to build your Team of the Week.";
  }
  if (count < TOTW_MIN_SQUAD_SIZE) {
    return `Squad has ${count} of ${TOTW_MIN_SQUAD_SIZE} required players. Add ${TOTW_MIN_SQUAD_SIZE - count} more to complete the XI.`;
  }
  if (count === TOTW_MIN_SQUAD_SIZE) {
    return `Full XI selected (${TOTW_MIN_SQUAD_SIZE} players). You can optionally add a Twelfth Man.`;
  }
  return null;
}
