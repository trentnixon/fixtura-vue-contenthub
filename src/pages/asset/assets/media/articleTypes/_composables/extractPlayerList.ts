import type { TopScorer } from "./useTop5Formatting";

const PLAYER_LIST_KEYS = [
  "top_scorers",
  "team_selection",
  "team_players",
  "players",
  "xi",
] as const;

function normalizePlayer(raw: Record<string, unknown>): TopScorer {
  return {
    position: Number(raw.position ?? raw.rank ?? 0),
    player_name: String(raw.player_name ?? raw.name ?? raw.player ?? ""),
    performance_stats: String(
      raw.performance_stats ?? raw.stats ?? raw.role ?? ""
    ),
    article_body: String(raw.article_body ?? raw.body ?? raw.description ?? ""),
  };
}

/**
 * Resolve player list from structuredOutput, trying known keys in order.
 */
export function extractPlayerList(
  structuredOutput: Record<string, unknown> | null | undefined
): TopScorer[] {
  if (!structuredOutput || typeof structuredOutput !== "object") {
    return [];
  }

  for (const key of PLAYER_LIST_KEYS) {
    const value = structuredOutput[key];
    if (Array.isArray(value) && value.length > 0) {
      return value.map((item) =>
        normalizePlayer(
          typeof item === "object" && item !== null
            ? (item as Record<string, unknown>)
            : {}
        )
      );
    }
  }

  return [];
}

/**
 * Returns true when structuredOutput contains a non-empty player list.
 */
export function hasPlayerListContent(
  structuredOutput: Record<string, unknown> | null | undefined
): boolean {
  return extractPlayerList(structuredOutput).length > 0;
}
