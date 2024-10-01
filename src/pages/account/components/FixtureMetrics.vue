<template>
  <!-- Loading with a different type -->
  <LoadingSpinner v-if="loading || !metricsOverTime" type="paragraph" />

  <!-- Error Message -->
  <ErrorMessage v-else-if="error" :message="error" />

  <template v-else>
    <v-row class="d-flex justify-center">
      <v-col cols="4" md="3">
        <CardSmall1DataPoint
          icon="mdi-calendar"
          buttonText=""
          :value="totalGameResults + totalUpcomingGames"
          subtitle="Total Fixtures"
          theme="cardNeutral"
        >
          <template v-slot:chart>
            <PieChartMini
              :data="TotalFixturesData"
              width="50px"
              height="50px"
            />
          </template>
        </CardSmall1DataPoint>
      </v-col>

      <v-col cols="4" md="3">
        <CardSmall1DataPoint
          icon="mdi-clock"
          buttonText=""
          :value="totalUpcomingGames"
          subtitle="Upcoming Games"
          theme="cardNeutral"
        >
          <template v-slot:chart>
            <BarChartMini :data="upcomingGamesArr" width="80px" height="50px" />
          </template>
        </CardSmall1DataPoint>
      </v-col>

      <v-col cols="4" md="3">
        <CardSmall1DataPoint
          icon="mdi-soccer"
          buttonText=""
          :value="totalGameResults"
          subtitle="Game Results"
          theme="cardNeutral"
        >
          <template v-slot:chart>
            <BarChartMini :data="gameResultsArr" width="80px" height="50px" />
          </template>
        </CardSmall1DataPoint>
      </v-col>

      <v-col cols="4" md="3">
        <CardSmall1DataPoint
          icon="mdi-school"
          buttonText=""
          :value="totalGrades"
          subtitle="Total Grades"
          theme="cardNeutral"
        >
          <template v-slot:chart>
            <BarChartMini
              :data="gradesArr"
              width="80px"
              height="50px"
              barColor="#4CAF50"
            />
          </template>
        </CardSmall1DataPoint>
      </v-col>
    </v-row>
  </template>
</template>

<script setup>
import { computed } from "vue";
import CardSmall1DataPoint from "@/components/primitives/cards/CardSmall1DataPoint.vue";
import PieChartMini from "@/components/charts/mini/PieChart.vue";
import BarChartMini from "@/components/charts/mini/BarChart.vue";

// Import composable
import { useAccountData } from "@/pages/account/composables/useAccountData";

// Fetch the data from the composable
const { metricsOverTime, loading, error } = useAccountData();

// Extract values from metricsOverTime
const totalGameResults = computed(() => metricsOverTime.value.totalGameResults);
const totalUpcomingGames = computed(
  () => metricsOverTime.value.totalUpcomingGames
);
const totalGrades = computed(() => metricsOverTime.value.totalGrades);
const totalDownloads = computed(() => metricsOverTime.value.totalDownloads);
const totalAiArticles = computed(() => metricsOverTime.value.totalAiArticles);

// Chart data for individual arrays
const gameResultsArr = computed(() => metricsOverTime.value.GameResultsArr);
const upcomingGamesArr = computed(() => metricsOverTime.value.UpcomingGamesArr);
const gradesArr = computed(() => metricsOverTime.value.GradesArr);
const downloadsArr = computed(() => metricsOverTime.value.DownloadsArr);
const aiArticlesArr = computed(() => metricsOverTime.value.AiArticlesArr);

// Pie chart data combining total upcoming games and total game results
const TotalFixturesData = computed(() => [
  { value: totalUpcomingGames.value, name: "Upcoming Games" },
  { value: totalGameResults.value, name: "Game Results" },
]);
</script>
