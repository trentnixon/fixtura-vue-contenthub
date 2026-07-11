<template>
  <div class="mb-4 bg-grey-lighten-4 rounded">
    <div class="mb-2">
      <span class="text-subtitle-1">Innings {{ inning.inningsNumber }}</span>
    </div>
    <div class="row mb-2">
      <div class="col-md-12">
        <v-textarea
          :model-value="combinedScoreDisplay"
          @update:model-value="updateCombinedScore($event || '')"
          label="Score (e.g., 10/291, 45.2 overs)"
          variant="outlined"
          density="compact"
          rows="2"
          hint="Enter the full score including wickets, runs, and overs in your preferred format"
          persistent-hint
        />
      </div>
    </div>
    <!-- Batting Order -->
    <PlayerStatsTable
      :battingOrder="inning.battingOrder"
      @update:battingOrder="updateField('battingOrder', $event)"
    />
    <!-- Bowling Figures -->
    <BowlingFiguresTable
      :bowlingFigures="inning.bowlingFigures"
      @update:bowlingFigures="updateField('bowlingFigures', $event)"
    />
    <!-- Fielding Stats -->
    <FieldingStatsTable
      :fieldingStats="inning.fieldingStats"
      @update:fieldingStats="updateField('fieldingStats', $event)"
    />
  </div>
</template>

<script setup lang="ts">
console.log("[InningsSection] Script loaded");

import { computed } from "vue";
import type { Innings } from "@/types/FixtureTypes";
import PlayerStatsTable from "./PlayerStatsTable.vue";
import BowlingFiguresTable from "./BowlingFiguresTable.vue";
import FieldingStatsTable from "./FieldingStatsTable.vue";

const props = defineProps<{
  inning: Innings;
  teamTotalScore?: string; // Team-level totalScore (e.g., "8/234") to use when innings.score is empty
}>();

// Log props immediately
console.log(
  "[InningsSection] Props received:",
  JSON.stringify(props.inning, null, 2)
);
console.log("[InningsSection] Inning keys:", Object.keys(props.inning || {}));
console.log("[InningsSection] inning.score:", props.inning?.score);
console.log("[InningsSection] inning.overs:", props.inning?.overs);
console.log("[InningsSection] inning.wickets:", props.inning?.wickets);

const emit = defineEmits<{
  "update:inning": [value: Innings];
  "add-player": [];
  "remove-player": [index: number];
  "add-bowler": [];
  "remove-bowler": [index: number];
  "add-fielder": [];
  "remove-fielder": [index: number];
}>();

// Display score from CMS - construct display from available data on initial load
// Once user edits, it will save to score field and show that (no auto-formatting after edit)
const combinedScoreDisplay = computed(() => {
  console.log("[InningsSection] combinedScoreDisplay computed running");
  const score = props.inning.score || "";
  const overs = props.inning.overs || "";
  const wickets = props.inning.wickets;

  // If score field already contains the full format (e.g., "8/234 (45)"), use it
  if (score && score.trim()) {
    // Check if score already includes overs in parentheses
    if (score.includes("(") && score.includes(")")) {
      return score; // Already has full format
    }

    // If score has "/" format (e.g., "8/234"), add overs if available
    if (score.includes("/") && overs && overs.trim()) {
      return `${score} (${overs})`;
    }

    // Otherwise just return score as-is
    return score;
  }

  // Score field is empty, construct from available data
  const parts: string[] = [];
  let constructedScore = "";

  // FIRST PRIORITY: Use team.totalScore if available (correct CMS score, e.g., "8/234")
  if (props.teamTotalScore && props.teamTotalScore.trim()) {
    constructedScore = props.teamTotalScore.trim();
    parts.push(constructedScore);
  } else {
    // FALLBACK: Try to construct score from fallOfWickets (last wicket shows final score)
    // Note: This may be inaccurate if fallOfWickets doesn't reflect the final score
    if (props.inning.fallOfWickets && props.inning.fallOfWickets.length > 0) {
      const lastWicket =
        props.inning.fallOfWickets[props.inning.fallOfWickets.length - 1];
      if (lastWicket && lastWicket.score) {
        // Last wicket score is in format "205/8" (runs/wickets)
        // We need to display as "8/205" (wickets/runs)
        const scoreMatch = lastWicket.score.match(/(\d+)\/(\d+)/);
        if (scoreMatch) {
          const [, runs, wicketsAtScore] = scoreMatch;
          // Use wickets from prop if available, otherwise from score
          const displayWickets = wickets || wicketsAtScore;
          constructedScore = `${displayWickets}/${runs}`;
          parts.push(constructedScore);
        }
      }
    }
  }

  // Calculate overs from bowling figures if overs field is empty
  let calculatedOvers = overs;
  if (
    !calculatedOvers &&
    props.inning.bowlingFigures &&
    props.inning.bowlingFigures.length > 0
  ) {
    let totalOvers = 0;
    props.inning.bowlingFigures.forEach((bowler) => {
      if (bowler.description) {
        // Match "bowled X overs" format
        const oversMatch = bowler.description.match(
          /bowled\s+(\d+)(?:\.(\d+))?\s+overs?/i
        );
        if (oversMatch) {
          const fullOvers = parseInt(oversMatch[1], 10);
          const balls = oversMatch[2] ? parseInt(oversMatch[2], 10) : 0;
          totalOvers += fullOvers + balls / 10; // Treat balls as decimal part
        }
      }
    });
    if (totalOvers > 0) {
      calculatedOvers =
        totalOvers % 1 === 0 ? totalOvers.toString() : totalOvers.toFixed(1);
    }
  }

  // Add overs if we have it
  if (calculatedOvers && calculatedOvers.trim()) {
    parts.push(`(${calculatedOvers})`);
  }

  return parts.join(" ");
});

// Update the score field - save exactly what the user types, no parsing or formatting
function updateCombinedScore(value: string) {
  // Store exactly what the user types, no auto-parsing or formatting
  updateField("score", value || "");
}

function updateField<K extends keyof Innings>(field: K, value: Innings[K]) {
  emit("update:inning", {
    ...props.inning,
    [field]: value,
  });
}
</script>
