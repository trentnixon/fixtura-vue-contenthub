/**
 * Fixture Data Types
 *
 * These types represent the structure of fixture data stored in ArticleDataForPrompt.
 * Each fixture's prompt string contains a JSON representation of FixtureData.
 */

/**
 * Match context information
 */
export interface MatchContext {
  competition: string;
  grade: string;
  ageGroup: string;
  gender: string;
  round: string;
  ground: string;
  date: string;
  matchType: string;
  status: string;
  tossWinner: string;
  tossResult: string;
  resultStatement: string;
  dayOne: string; // ISO date string
  finalDaysPlay: string; // ISO date string
}

/**
 * Individual player batting statistics
 * Now uses a description string instead of individual fields
 */
export interface PlayerStats {
  description: string;
}

/**
 * Bowling figures for a player
 * Now uses a description string instead of individual fields
 */
export interface BowlingFigures {
  description: string;
}

/**
 * Fielding statistics for a player
 * Now uses a description string instead of individual fields
 */
export interface FieldingStats {
  description: string;
}

/**
 * Fall of wickets information
 */
export interface FallOfWickets {
  wicketNumber: number;
  score: string;
  batsman: string;
}

/**
 * Single innings data
 */
export interface Innings {
  teamName: string;
  score: string;
  overs: string;
  wickets: number;
  battingOrder: PlayerStats[];
  bowlingFigures: BowlingFigures[];
  fieldingStats: FieldingStats[];
  fallOfWickets: FallOfWickets[];
  inningsNumber: number;
  inningsName: string;
}

/**
 * Team data (home or away)
 */
export interface Team {
  teamName: string;
  innings: Innings[];
  totalScore: string; // e.g., "10/291"
  totalWickets: number;
}

/**
 * Account bias information
 */
export interface AccountBias {
  isBias: string;
  clubTeams: string[];
  focusedTeams: string[];
}

/**
 * Complete fixture data structure
 */
export interface FixtureData {
  matchContext: MatchContext;
  homeTeam: Team;
  awayTeam: Team;
  accountBias?: AccountBias; // Optional - associations won't have accountBias
}

/**
 * Parsed fixture prompt with both string and parsed data
 */
export interface ParsedFixturePrompt {
  prompt: string; // Original JSON string
  parsedData: FixtureData; // Parsed fixture data
}

/**
 * Parse a fixture prompt JSON string into typed FixtureData
 * @param promptString - JSON string containing fixture data
 * @returns Parsed FixtureData object
 * @throws Error if parsing fails or data structure is invalid
 */
export function parseFixturePrompt(promptString: string): FixtureData {
  // Check if prompt string is empty or whitespace
  if (!promptString || !promptString.trim()) {
    throw new Error("Fixture prompt string is empty or invalid");
  }

  // Check if the string looks like JSON (should start with { or [)
  const trimmed = promptString.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    const preview = trimmed.length > 50 ? trimmed.substring(0, 50) + '...' : trimmed;
    throw new Error(`Fixture prompt is not valid JSON. Expected JSON object/array but got: "${preview}"`);
  }

  try {
    const parsed = JSON.parse(promptString) as Partial<FixtureData>;

    // Basic validation - check required top-level fields with detailed error messages
    const missingFields: string[] = [];

    if (!parsed.matchContext) {
      missingFields.push("matchContext");
    }
    if (!parsed.homeTeam) {
      missingFields.push("homeTeam");
    }
    if (!parsed.awayTeam) {
      missingFields.push("awayTeam");
    }

    // Validate accountBias structure if present (optional field - associations won't have it)
    if (parsed.accountBias) {
      // Ensure arrays exist if accountBias object is present but incomplete
      if (!Array.isArray(parsed.accountBias.clubTeams)) {
        parsed.accountBias.clubTeams = [];
      }
      if (!Array.isArray(parsed.accountBias.focusedTeams)) {
        parsed.accountBias.focusedTeams = [];
      }
      if (parsed.accountBias.isBias === undefined || parsed.accountBias.isBias === null) {
        parsed.accountBias.isBias = "";
      }
    }

    if (missingFields.length > 0) {
      throw new Error(
        `Invalid fixture data structure: missing required fields: ${missingFields.join(", ")}`
      );
    }

    return parsed as FixtureData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Extract just the error type and position, not the full invalid JSON snippet
      const errorMsg = error.message;
      // Remove the invalid JSON snippet from the error message if present
      const cleanErrorMsg = errorMsg.split(',')[0] || errorMsg;
      throw new Error(`Failed to parse fixture prompt JSON: ${cleanErrorMsg}`);
    }
    throw error;
  }
}

/**
 * Convert FixtureData object back to JSON string
 * @param fixtureData - Typed fixture data object
 * @returns JSON string representation
 * @throws Error if stringification fails
 */
export function stringifyFixtureData(fixtureData: FixtureData): string {
  try {
    return JSON.stringify(fixtureData, null, 2);
  } catch (error) {
    throw new Error(
      `Failed to stringify fixture data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Validate fixture data structure
 * @param fixtureData - Fixture data to validate
 * @returns true if valid, false otherwise
 */
export function validateFixtureData(fixtureData: FixtureData): boolean {
  try {
    // Check required top-level fields
    if (
      !fixtureData.matchContext ||
      !fixtureData.homeTeam ||
      !fixtureData.awayTeam
    ) {
      return false;
    }

    // Validate matchContext has required fields
    const mc = fixtureData.matchContext;
    if (!mc.competition || !mc.grade || !mc.status) {
      return false;
    }

    // Validate teams have required fields
    if (!fixtureData.homeTeam.teamName || !fixtureData.awayTeam.teamName) {
      return false;
    }

    // Validate accountBias structure if present (optional field)
    if (fixtureData.accountBias) {
      if (
        !Array.isArray(fixtureData.accountBias.clubTeams) ||
        !Array.isArray(fixtureData.accountBias.focusedTeams)
      ) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Create a deep clone of fixture data to prevent mutation
 * @param fixtureData - Fixture data to clone
 * @returns Deep cloned copy of fixture data
 */
export function cloneFixtureData(fixtureData: FixtureData): FixtureData {
  return JSON.parse(JSON.stringify(fixtureData));
}
