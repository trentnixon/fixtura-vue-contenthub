import { computed, ref, type Ref } from "vue";
import type { ParsedFixturePrompt } from "@/types/FixtureTypes";
import { getFixtureSummary } from "../_utils/fixtureHelpers";

/**
 * Composable for fixture search, filter, and sort functionality
 */
export function useFixtureSearchSort(fixtures: Ref<ParsedFixturePrompt[]>) {
  // Search/filter and sort state
  const searchQuery = ref("");
  const sortBy = ref<"date" | "competition" | "team" | null>(null);
  const sortOrder = ref<"asc" | "desc">("asc");

  // Filtered and sorted fixtures with original index mapping
  const filteredAndSortedFixtures = computed(() => {
    let result = fixtures.value.map((fixture, originalIndex) => ({
      fixture,
      originalIndex,
    }));

    // Apply search/filter
    const queryText = searchQuery.value?.trim() || "";
    if (queryText) {
      const query = queryText.toLowerCase();
      result = result.filter(({ fixture }) => {
        const data = fixture.parsedData;
        const searchableText = [
          data.matchContext.competition,
          data.matchContext.grade,
          data.matchContext.date,
          data.matchContext.ground,
          data.homeTeam.teamName,
          data.awayTeam.teamName,
          data.matchContext.status,
        ]
          .join(" ")
          .toLowerCase();
        return searchableText.includes(query);
      });
    }

    // Apply sorting
    if (sortBy.value) {
      result = result.sort((a, b) => {
        const dataA = a.fixture.parsedData;
        const dataB = b.fixture.parsedData;
        let comparison = 0;

        switch (sortBy.value) {
          case "date":
            comparison = (dataA.matchContext.date || "").localeCompare(
              dataB.matchContext.date || ""
            );
            break;
          case "competition":
            comparison = (dataA.matchContext.competition || "").localeCompare(
              dataB.matchContext.competition || ""
            );
            break;
          case "team": {
            const teamA = `${dataA.homeTeam.teamName} vs ${dataA.awayTeam.teamName}`;
            const teamB = `${dataB.homeTeam.teamName} vs ${dataB.awayTeam.teamName}`;
            comparison = teamA.localeCompare(teamB);
            break;
          }
        }

        return sortOrder.value === "asc" ? comparison : -comparison;
      });
    }

    return result;
  });

  return {
    searchQuery,
    sortBy,
    sortOrder,
    filteredAndSortedFixtures,
    getFixtureSummary,
  };
}
