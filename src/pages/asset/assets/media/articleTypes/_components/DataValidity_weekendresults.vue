<template>
    <div class="w-100 bg-grey-lighten-4 pt-3 pt-sm-4 px-2 px-sm-4 pb-2 mt-4"
        style="border-top: 1px solid rgba(0,0,0,0.08);">
        <div v-if="isSavingFixtures" class="text-caption text-grey d-flex align-center">
            <v-progress-circular indeterminate color="grey" size="12" class="mr-1"
                style="width: 12px; height: 12px;"></v-progress-circular>
            <span class="text-caption">Refreshing...</span>
        </div>
        <div v-else-if="isValidating" class="d-flex flex-column">
            <!-- Skeleton Loader -->
            <div class="d-flex align-center mb-1">
                <v-skeleton-loader type="text" width="100" class="mr-2"></v-skeleton-loader>
                <v-skeleton-loader type="text" width="60" class="mr-2"></v-skeleton-loader>
                <v-skeleton-loader type="text" width="120"></v-skeleton-loader>
            </div>
            <v-skeleton-loader type="text" width="100%"></v-skeleton-loader>
        </div>
        <div v-else-if="!articles || articles.length === 0" class="text-caption text-grey">No articles available</div>
        <div v-else-if="validationResults.length === 0" class="text-caption text-grey">No fixtures found</div>
        <div v-else>
            <div class="d-flex flex-column flex-sm-row align-center align-sm-start justify-center justify-sm-space-between mb-1"
                style="gap: 8px;">
                <div class="d-flex align-center justify-center flex-sm-justify-start flex-wrap" style="gap: 4px;">
                    <span class="text-caption text-grey">Data Validity:</span>
                    <v-tooltip location="top">
                        <template v-slot:activator="{ props: tooltipProps }">
                            <span v-bind="tooltipProps" class="text-body-2 font-weight-medium cursor-pointer"
                                :class="overallScore >= 75 ? 'text-success' : overallScore >= 50 ? 'text-warning' : 'text-error'">
                                {{ overallScore }}/100
                            </span>
                        </template>
                        <div style="white-space: pre-line; max-width: 300px;">
                            {{ scoreTooltipText }}
                        </div>
                    </v-tooltip>
                    <span class="text-caption text-grey">
                        ({{ validationResults.length }} {{ validationResults.length === 1 ? 'fixture' : 'fixtures' }})
                    </span>
                </div>
                <!-- Dialog Button - Only show if score is not 100 -->
                <v-btn v-if="overallScore < PERFECT_SCORE" color="warning" variant="tonal" size="small"
                    @click="showMissingDataDialog = true" class="text-caption" density="comfortable"
                    :aria-label="`View missing data for ${fixturesWithMissingData.length} ${fixturesWithMissingData.length === 1 ? 'fixture' : 'fixtures'}`">
                    <v-icon start size="14" class="mr-1">mdi-information-outline</v-icon>
                    View Missing
                </v-btn>
            </div>
            <!-- Summary Text - Hidden on mobile, shown on desktop -->
            <div class="text-caption text-grey text-center text-sm-left mt-1 d-none d-sm-block">
                {{ validitySummary }}
            </div>
        </div>

        <!-- Missing Data Dialog -->
        <v-dialog v-model="showMissingDataDialog" max-width="700" :fullscreen="false" :scrollable="isMobile">
            <v-card :class="isMobile ? 'ma-2' : ''" style="max-height: 90vh;">
                <v-card-title class="text-h6 d-flex align-center">
                    <v-icon class="mr-2" color="error">mdi-alert-circle</v-icon>
                    Missing Data Details
                </v-card-title>
                <v-card-text class="pa-3 pa-sm-4">
                    <div v-for="(result, index) in fixturesWithMissingData" :key="index" class="mb-4">
                        <p class="text-subtitle-2 font-weight-bold mb-2" style="word-break: break-word;">
                            {{ result.homeTeamName || 'Home Team' }} vs {{ result.awayTeamName || 'Away Team' }}
                        </p>
                        <div class="pa-2 bg-error-lighten-5 rounded">
                            <p class="text-caption font-weight-bold text-error mb-1">Missing Data:</p>
                            <ul class="text-caption text-error mb-0 pl-4" style="list-style-type: disc;">
                                <li v-if="!result.tossWinner.present">Toss Winner</li>
                                <li v-if="!result.tossResult.present">Toss Result</li>
                                <li v-if="!result.resultStatement.present">Result Statement</li>
                                <li v-if="!result.hasPlayerPerformance">Player Performance</li>
                            </ul>
                        </div>
                    </div>
                    <div v-if="fixturesWithMissingData.length === 0" class="text-center pa-4">
                        <v-icon color="success" size="48" class="mb-2">mdi-check-circle</v-icon>
                        <p class="text-body-1 text-success">All fixtures have complete data!</p>
                    </div>
                    <!-- Instruction shown once at bottom if there are fixtures with missing data -->
                    <div v-if="fixturesWithMissingData.length > 0" class="mt-4 pt-3 border-t">
                        <div class="d-flex align-center flex-wrap justify-center justify-sm-start" style="gap: 4px;">
                            <v-icon size="12">mdi-information</v-icon>
                            <span class="text-caption text-grey-darken-1">To fix: Click the</span>
                            <v-icon size="20" color="success" class="flex-shrink-0">mdi-pencil-box</v-icon>
                            <span class="text-caption text-grey-darken-1">button, find the fixture, and add the missing
                                data.</span>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="showMissingDataDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import type { FlattenedArticle } from "@/types/ArticleTypes";
import { parseFixturePrompt } from "@/types/FixtureTypes";

const { mobile } = useDisplay();
const isMobile = computed(() => mobile.value);

const props = defineProps<{
    articles?: FlattenedArticle[];
    isSavingFixtures?: boolean;
}>();

interface ValidationField {
    present: boolean;
    value: string | null;
}

interface ValidationResult {
    tossWinner: ValidationField;
    tossResult: ValidationField;
    resultStatement: ValidationField;
    hasMismatch: boolean;
    hasPlayerPerformance: boolean;
    playerCount: number;
    score: number; // Score out of 100 for this fixture
    homeTeamName: string | null;
    awayTeamName: string | null;
}

const validationResults = ref<ValidationResult[]>([]);
const showMissingDataDialog = ref(false);
const isValidating = ref(false);

// Constants for scoring
const POINTS_PER_CHECK = 25;
const PERFECT_SCORE = 100;

// Get fixtures with missing data (score < 100)
const fixturesWithMissingData = computed(() => {
    return validationResults.value
        .filter(result => result.score < PERFECT_SCORE);
});

// Extract and validate fields from fixtures
function validateFixtures() {
    isValidating.value = true;
    // Use setTimeout to allow UI to update and show skeleton
    setTimeout(() => {
        try {
            if (!props.articles || props.articles.length === 0) {
                validationResults.value = [];
                return;
            }

            // Get ArticleDataForPrompt from the first article (same as useFixtureEditing does)
            const firstArticle = props.articles[0];
            const articleDataForPrompt = firstArticle?.ArticleDataForPrompt;

            if (!articleDataForPrompt || !Array.isArray(articleDataForPrompt) || articleDataForPrompt.length === 0) {
                validationResults.value = [];
                return;
            }

            const results: ValidationResult[] = [];

            for (const fixturePrompt of articleDataForPrompt) {
                // Get the prompt string
                const promptString = fixturePrompt.prompt;

                let tossWinner: string | null = null;
                let tossResult: string | null = null;
                let resultStatement: string | null = null;

                if (!promptString || typeof promptString !== 'string') {
                    // If no prompt, mark all as missing (score = 0)
                    results.push({
                        tossWinner: { present: false, value: null },
                        tossResult: { present: false, value: null },
                        resultStatement: { present: false, value: null },
                        hasMismatch: false,
                        hasPlayerPerformance: false,
                        playerCount: 0,
                        score: 0,
                        homeTeamName: null,
                        awayTeamName: null,
                    });
                    continue;
                }

                try {
                    // Parse the prompt using the shared helper (same as useFixtureEditing)
                    const parsed = parseFixturePrompt(promptString);

                    // Extract fields from matchContext in the prompt
                    const matchContext = parsed.matchContext || {};

                    tossWinner = matchContext.tossWinner || null;
                    tossResult = matchContext.tossResult || null;
                    resultStatement = matchContext.resultStatement || null;

                    // Check for player performances in battingOrder across all innings
                    let totalPlayerCount = 0;
                    const homeTeam = parsed.homeTeam || {};
                    const awayTeam = parsed.awayTeam || {};

                    // Extract team names
                    const homeTeamName = homeTeam.teamName || null;
                    const awayTeamName = awayTeam.teamName || null;

                    // Helper function to count players in a team's innings
                    const countPlayersInTeam = (team: typeof homeTeam) => {
                        if (!team.innings || !Array.isArray(team.innings)) return 0;
                        return team.innings.reduce((count, inning) => {
                            return count + (inning.battingOrder && Array.isArray(inning.battingOrder) ? inning.battingOrder.length : 0);
                        }, 0);
                    };

                    totalPlayerCount = countPlayersInTeam(homeTeam) + countPlayersInTeam(awayTeam);

                    // Calculate score: POINTS_PER_CHECK points per check (TOTAL_CHECKS checks = 100 points total)
                    const checks = [
                        !!tossWinner && tossWinner.trim() !== '', // Toss Winner
                        !!tossResult && tossResult.trim() !== '', // Toss Result
                        !!resultStatement && resultStatement.trim() !== '', // Result Statement
                        totalPlayerCount >= 1, // Player Performance
                    ];
                    const score = checks.filter(Boolean).length * POINTS_PER_CHECK;

                    results.push({
                        tossWinner: {
                            present: !!tossWinner && tossWinner.trim() !== '',
                            value: tossWinner || null,
                        },
                        tossResult: {
                            present: !!tossResult && tossResult.trim() !== '',
                            value: tossResult || null,
                        },
                        resultStatement: {
                            present: !!resultStatement && resultStatement.trim() !== '',
                            value: resultStatement || null,
                        },
                        hasMismatch: false,
                        hasPlayerPerformance: totalPlayerCount >= 1,
                        playerCount: totalPlayerCount,
                        score: score,
                        homeTeamName: homeTeamName,
                        awayTeamName: awayTeamName,
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.error('Failed to parse fixture prompt:', errorMessage);
                    // Create a result with all fields missing due to parse error
                    results.push({
                        tossWinner: { present: false, value: null },
                        tossResult: { present: false, value: null },
                        resultStatement: { present: false, value: null },
                        hasMismatch: false,
                        hasPlayerPerformance: false,
                        playerCount: 0,
                        score: 0,
                        homeTeamName: null,
                        awayTeamName: null,
                    });
                }
            }

            validationResults.value = results;
        } finally {
            isValidating.value = false;
        }
    }, 0);
}

// Calculate overall score (average of all fixture scores)
const overallScore = computed(() => {
    if (validationResults.value.length === 0) return 0;
    const totalScore = validationResults.value.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / validationResults.value.length);
});

// Generate summary text based on score (in 10% increments)
const validitySummary = computed(() => {
    const score = overallScore.value;

    if (score === 100) return "Excellent - All data is complete and ready for article generation.";
    if (score >= 91) return "Very good - Data is nearly complete with minimal issues.";
    if (score >= 81) return "Good - Most data is present, minor improvements needed.";
    if (score >= 71) return "Above average - Some data missing, review recommended.";
    if (score >= 61) return "Average - Several data points need attention.";
    if (score >= 51) return "Below average - Multiple data fields require updates.";
    if (score >= 41) return "Low - Significant data gaps need to be addressed.";
    if (score >= 31) return "Very low - Major data issues present.";
    if (score >= 21) return "Poor - Critical data missing, urgent action required.";
    if (score >= 11) return "Very poor - Most data is missing, article generation may be limited.";
    return "Critical - Data is incomplete, article generation will be severely limited.";
});

// Tooltip text explaining the score
const scoreTooltipText = computed(() => {
    const checks = "• Toss Winner • Toss Result • Result Statement • Player Performance";
    const scoreInfo = `Score: ${overallScore.value}/100 (average across ${validationResults.value.length} ${validationResults.value.length === 1 ? 'fixture' : 'fixtures'})`;
    return `Data validity score calculated from 4 checks (25 points each):\n${checks}\n\n${scoreInfo}`;
});

// Watch for changes in articles - only watch the ArticleDataForPrompt array to avoid unnecessary re-validation
watch(
    () => props.articles?.[0]?.ArticleDataForPrompt,
    () => {
        validateFixtures();
    },
    { immediate: true, deep: true }
);
</script>
