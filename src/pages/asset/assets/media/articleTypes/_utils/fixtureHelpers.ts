import type { ParsedFixturePrompt } from "@/types/FixtureTypes";

/**
 * Generate fixture summary object for display in list view
 * @param fixture - The fixture prompt data
 * @param index - The original index of the fixture in the array
 * @param unsavedChanges - Set of indices that have unsaved changes
 * @returns Summary object with display properties
 */
export function getFixtureSummary(
  fixture: ParsedFixturePrompt,
  index: number,
  unsavedChanges: Set<number>
) {
  const data = fixture.parsedData;
  return {
    index: index + 1,
    competition: data.matchContext.competition,
    grade: data.matchContext.grade,
    ageGroup: data.matchContext.ageGroup || "",
    date: data.matchContext.date,
    ground: data.matchContext.ground,
    homeTeam: data.homeTeam.teamName,
    awayTeam: data.awayTeam.teamName,
    homeScore: data.homeTeam.totalScore,
    awayScore: data.awayTeam.totalScore,
    status: data.matchContext.status,
    hasUnsavedChanges: unsavedChanges.has(index),
  };
}
