/** Categories accepted by Remotion CricketTeamOfTheWeek */
export type TotwRemotionCategory =
  | "Batter"
  | "Bowler"
  | "All-Rounder"
  | "Twelfth Man";

/** Edit UI category — Wicket-Keeper uses fixed position slug `wicketKeeper` */
export type TotwEditCategory = TotwRemotionCategory | "Wicket-Keeper";

export type TotwPositionSlug =
  | "topscorer"
  | "higheststrikerate"
  | "mostwickets"
  | "besteconomy"
  | "topallrounder"
  | "bestoftherest"
  | "wicketKeeper";

export interface TotwPositionOption {
  label: string;
  value: TotwPositionSlug;
}

/** @deprecated Use TotwEditCategory or TotwRemotionCategory */
export type TotwCategory = TotwEditCategory;

export interface TotwCategoryDetail {
  type: string;
  position: string;
}

export interface TotwClub {
  name: string;
  logo: {
    url: string;
    width: number;
    height: number;
  };
}

export interface TotwBattingStats {
  runs?: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  strikeRate?: number;
  notOut?: boolean;
  team?: string;
}

export interface TotwBowlingStats {
  wickets?: number;
  overs?: number;
  maidens?: number;
  runs?: number;
  economy?: number;
  team?: string;
}

export interface TotwAllRounderStats {
  score?: number;
  formula?: string;
  battingContribution?: number;
  bowlingContribution?: number;
}

/** Stored in CMS only — Remotion does not render fielding today */
export interface TotwFieldingStats {
  catches?: number;
  stumpings?: number;
}

export interface TotwPlayer {
  category: TotwEditCategory | TotwRemotionCategory | string;
  categoryDetail?: TotwCategoryDetail;
  rank: number;
  player: string;
  primaryTeam?: string;
  club?: TotwClub;
  batting?: TotwBattingStats;
  bowling?: TotwBowlingStats;
  allRounder?: TotwAllRounderStats;
  fielding?: TotwFieldingStats;
  rankings?: Record<string, number>;
  prompt?: string;
}

/** Full XI — twelfth man is optional slot 12 */
export const TOTW_MIN_SQUAD_SIZE = 11;
export const TOTW_MAX_SQUAD_SIZE = 12;
export const TOTW_MAX_BATTERS = 5;
export const TOTW_MAX_BOWLERS = 4;
