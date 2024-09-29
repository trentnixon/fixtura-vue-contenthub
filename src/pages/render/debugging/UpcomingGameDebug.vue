<template>
    <v-container fluid class="pa-0">
        <h1>Upcoming Games Debug Information</h1>

        <v-alert v-if="error" type="error" class="mt-4">
            Error: {{ error }}
        </v-alert>

        <v-progress-circular v-if="loading" indeterminate color="primary" class="mt-4"></v-progress-circular>

        <div v-if="groupUpcomingGamesBySport && !loading" class="mt-4">
            <v-expansion-panels flat>
                <!-- Grouped by Sport -->
                <v-expansion-panel v-for="(games, sport) in groupUpcomingGamesBySport" :key="sport">
                    <v-expansion-panel-title color="primary">{{ sport }}</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <ul>
                            <li v-for="game in games" :key="game.id">
                                {{ game.attributes.game_meta_datum?.data?.attributes?.round }} -
                                {{ game.attributes.game_meta_datum?.data?.attributes?.teamHome }} vs
                                {{ game.attributes.game_meta_datum?.data?.attributes?.teamAway }}
                                ({{ game.attributes.game_meta_datum?.data?.attributes?.date }})
                            </li>
                        </ul>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
    </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUpcomingGameData } from "@/pages/render/composables/useUpcomingGameData";

// Get route parameters
const route = useRoute();
const renderId = Number(route.params.renderid);

const {
    fetchUpcomingGamesByRenderId,
    groupUpcomingGamesBySport,
    loading,
    error,
} = useUpcomingGameData();

// Fetch upcoming games by render ID on component mount
/* onMounted(async () => {
    await fetchUpcomingGamesByRenderId(renderId);
}); */
</script>

<style scoped>
pre {
    background: #f5f5f5;
    padding: 16px;
    border-radius: 4px;
}
</style>