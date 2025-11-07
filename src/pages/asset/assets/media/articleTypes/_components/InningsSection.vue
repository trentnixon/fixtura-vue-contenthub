<template>
    <div class="mb-4 bg-grey-lighten-4 rounded">
        <div class="mb-2">
            <span class="text-subtitle-1">Innings {{ inning.inningsNumber }}</span>
        </div>
        <div class="row mb-2">
            <div class="col-md-12">
                <v-textarea :model-value="combinedScoreDisplay" @update:model-value="updateCombinedScore($event || '')"
                    label="Score (e.g., 10/291, 45.2 overs)" variant="outlined" density="compact" rows="2"
                    hint="Enter the full score including wickets, runs, and overs in your preferred format"
                    persistent-hint />
            </div>
        </div>
        <!-- Batting Order -->
        <PlayerStatsTable :battingOrder="inning.battingOrder"
            @update:battingOrder="updateField('battingOrder', $event)" />
        <!-- Bowling Figures -->
        <BowlingFiguresTable :bowlingFigures="inning.bowlingFigures"
            @update:bowlingFigures="updateField('bowlingFigures', $event)" />
        <!-- Fielding Stats -->
        <FieldingStatsTable :fieldingStats="inning.fieldingStats"
            @update:fieldingStats="updateField('fieldingStats', $event)" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Innings } from "@/types/FixtureTypes";
import PlayerStatsTable from "./PlayerStatsTable.vue";
import BowlingFiguresTable from "./BowlingFiguresTable.vue";
import FieldingStatsTable from "./FieldingStatsTable.vue";

const props = defineProps<{
    inning: Innings;
}>();

const emit = defineEmits<{
    "update:inning": [value: Innings];
    "add-player": [];
    "remove-player": [index: number];
    "add-bowler": [];
    "remove-bowler": [index: number];
    "add-fielder": [];
    "remove-fielder": [index: number];
}>();

// Combine score, overs, and wickets into a single display string
const combinedScoreDisplay = computed(() => {
    let score = props.inning.score || '';
    let overs = props.inning.overs || '';
    const wickets = props.inning.wickets;

    // If score is empty, try to extract it from fallOfWickets (last wicket shows final score)
    if (!score && props.inning.fallOfWickets && props.inning.fallOfWickets.length > 0) {
        const lastWicket = props.inning.fallOfWickets[props.inning.fallOfWickets.length - 1];
        if (lastWicket && lastWicket.score) {
            // Last wicket score is in format "333/9" (runs/wickets), we need "9/333" (wickets/runs)
            const scoreMatch = lastWicket.score.match(/(\d+)\/(\d+)/);
            if (scoreMatch) {
                const [, runs, wicketsAtScore] = scoreMatch;
                // Use the final wickets count if available, otherwise use wickets from score
                score = `${wickets || wicketsAtScore}/${runs}`;
            }
        }
    }

    // If overs is empty, try to extract from bowling figures
    // Total innings overs = sum of all overs bowled by all bowlers
    if (!overs && props.inning.bowlingFigures && props.inning.bowlingFigures.length > 0) {
        // Parse bowling figures descriptions to extract overs
        // Format: "Ben Stoyanoff, bowled 10 overs, took 3 wickets..."
        let totalBalls = 0;

        props.inning.bowlingFigures.forEach((bowler) => {
            if (bowler.description) {
                // Match "bowled X overs" or "bowled X.Y overs" format
                const oversMatch = bowler.description.match(/bowled\s+(\d+)(?:\.(\d+))?\s+overs?/i);
                if (oversMatch) {
                    const fullOvers = parseInt(oversMatch[1], 10);
                    const balls = oversMatch[2] ? parseInt(oversMatch[2], 10) : 0;
                    // Convert to total balls (6 balls = 1 over)
                    totalBalls += (fullOvers * 6) + balls;
                }
            }
        });

        // Convert total balls back to overs (6 balls = 1 over)
        if (totalBalls > 0) {
            const totalOvers = totalBalls / 6;
            overs = totalOvers % 1 === 0 ? totalOvers.toString() : totalOvers.toFixed(1);
        }
    }

    // If score already contains a full format (e.g., "8/291" or "10/200"), use it as-is
    if (score && score.includes('/')) {
        const parts: string[] = [score];
        if (overs) {
            parts.push(`${overs} overs`);
        }
        return parts.join(', ');
    }

    // If score has content but no slash, try to use it
    if (score && score.trim()) {
        // Check if score might be just runs (a number)
        const scoreNum = Number(score);
        if (!isNaN(scoreNum) && wickets !== undefined && wickets !== null) {
            // We have both runs and wickets, format as wickets/runs
            const parts: string[] = [`${wickets}/${scoreNum}`];
            if (overs) {
                parts.push(`${overs} overs`);
            }
            return parts.join(', ');
        } else {
            // Score might be in a different format, use it as-is
            const parts: string[] = [score];
            if (wickets !== undefined && wickets !== null && wickets !== 0) {
                // Add wickets if not already in score
                if (!score.toLowerCase().includes('wicket')) {
                    parts.push(`${wickets} wickets`);
                }
            }
            if (overs) {
                parts.push(`${overs} overs`);
            }
            return parts.join(', ');
        }
    }

    // No score data, construct from wickets and overs
    const parts: string[] = [];

    if (wickets !== undefined && wickets !== null && wickets !== 0) {
        parts.push(`${wickets} wickets`);
    }

    if (overs) {
        parts.push(`${overs} overs`);
    }

    return parts.join(', ') || '';
});

// Update the combined score field - store in score field for flexibility
function updateCombinedScore(value: string) {
    // Store the entire string in the score field for now
    // Users can write in their preferred format (e.g., "10/291, 45.2 overs" or "291/10 (45.2)")
    updateField('score', value);

    // Try to parse overs and wickets if possible, but don't force it
    // This allows backwards compatibility while giving users flexibility
    const oversMatch = value.match(/(\d+\.?\d*)\s*overs?/i);
    if (oversMatch) {
        updateField('overs', oversMatch[1]);
    }

    // Try to extract wickets if written separately (not in score format like "10/291")
    const wicketsMatch = value.match(/(\d+)\s*wickets?/i);
    if (wicketsMatch && !value.includes('/')) {
        updateField('wickets', Number(wicketsMatch[1]));
    }
}

function updateField<K extends keyof Innings>(field: K, value: Innings[K]) {
    emit("update:inning", {
        ...props.inning,
        [field]: value,
    });
}
</script>
