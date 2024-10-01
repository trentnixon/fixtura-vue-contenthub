<template>
  <v-container fluid class="pa-0">
    <h1>Game Results In Render Debug Information</h1>

    <v-alert v-if="error" type="error" class="mt-4">
      Error: {{ error }}
    </v-alert>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="mt-4"
    ></v-progress-circular>

    <div v-if="gameResultsInRenderByRenderID.length && !loading" class="mt-4">
      <v-expansion-panels flat>
        <!-- Grouped by Sport -->
        <v-expansion-panel
          v-for="(results, sport) in groupGameResultsBySport"
          :key="sport"
        >
          <v-expansion-panel-title
            >{{ sport }} Game Results</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <ul>
              <li v-for="result in results" :key="result.id">
                ID: {{ result.id }} | Meta Data:
                {{ result.attributes.game_meta_datum?.data?.id }}
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
import { useGameResultsInRenderData } from "@/pages/render/composables/OLD_useGameResultsInRenderData";

// Get route parameters
const route = useRoute();
const renderId = Number(route.params.renderid);

const {
  gameResultsInRenderByRenderID,
  fetchGameResultsByRenderId,
  loading,
  error,
  groupGameResultsBySport,
} = useGameResultsInRenderData();

// Fetch game results for the render on component mount
/*  onMounted(async () => {
    await fetchGameResultsByRenderId(renderId);
  }); */
</script>

<style scoped>
pre {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
}
</style>
