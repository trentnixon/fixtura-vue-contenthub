<!-- src/components/render/FixtureStats.vue -->
<template>
  <v-row
    class="d-flex justify-center"
    v-if="renderMetrics && renderMetrics.summary"
  >
    <v-col cols="4" md="3">
      <CardSmall1DataPoint
        icon="mdi-calendar"
        buttonText=""
        :value="renderMetrics.summary.totalFixtures"
        subtitle="Total Fixtures"
        theme="cardNeutral"
      >
        <template v-slot:chart>
          <PieChartMini :data="TotalFixturesData" width="50px" height="50px" />
        </template>
      </CardSmall1DataPoint>
    </v-col>

    <v-col cols="4" md="3">
      <CardSmall1DataPoint
        icon="mdi-clock"
        buttonText=""
        :value="renderMetrics.summary.totalUpcomingGames"
        subtitle="Upcoming Games"
        theme="cardNeutral"
      >
        <template v-slot:chart>
          <BarChartMini :data="upcomingData" width="50px" height="30px" />
        </template>
      </CardSmall1DataPoint>
    </v-col>

    <v-col cols="4" md="3">
      <CardSmall1DataPoint
        icon="mdi-soccer"
        buttonText=""
        :value="renderMetrics.summary.totalGameResults"
        subtitle="Game Results"
        theme="cardNeutral"
      >
        <template v-slot:chart>
          <BarChartMini :data="resultsData" width="50px" height="30px" />
        </template>
      </CardSmall1DataPoint>
    </v-col>

    <v-col cols="4" md="3">
      <CardSmall1DataPoint
        icon="mdi-school"
        buttonText=""
        :value="renderMetrics.summary.totalGrades"
        subtitle="Total Grades"
        theme="cardNeutral"
      >
        <template v-slot:chart>
          <BarChartMini
            :data="totalGradesData"
            width="50px"
            height="30px"
            barColor="#4CAF50"
          />
        </template>
      </CardSmall1DataPoint>
    </v-col>
  </v-row>

  <!-- Add a loader or fallback in case data is not ready -->
  <div v-else class="text-center">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import CardSmall1DataPoint from "@/components/primitives/cards/CardSmall1DataPoint.vue";
import PieChartMini from "@/components/charts/mini/PieChart.vue";
import BarChartMini from "@/components/charts/mini/BarChart.vue";
import { useRenderData } from "@/pages/render/composables/useRenderData";

// Destructure the render metrics from the composable
const { renderMetrics } = useRenderData();

// Define the computed properties for charts
const TotalFixturesData = computed(() => [
  {
    value: renderMetrics.value?.summary?.totalUpcomingGames || 0,
    name: "Upcoming",
  },
  {
    value: renderMetrics.value?.summary?.totalGameResults || 0,
    name: "Results",
  },
]);

const upcomingData = computed(() => [
  renderMetrics.value?.summary?.totalUpcomingGames || 0,
  renderMetrics.value?.summary?.totalGameResults || 0,
]);

const resultsData = computed(() => [
  renderMetrics.value?.summary?.totalGameResults || 0,
  renderMetrics.value?.summary?.totalUpcomingGames || 0,
]);

const totalGradesData = computed(() => [
  renderMetrics.value?.summary?.totalGrades || 0,
]);

// Watch for changes in renderMetrics and ensure it's ready before rendering
watch(renderMetrics, (newVal) => {
  if (!newVal || !newVal.summary) {
    console.warn("renderMetrics is not ready or summary is missing.");
  }
});
</script>
