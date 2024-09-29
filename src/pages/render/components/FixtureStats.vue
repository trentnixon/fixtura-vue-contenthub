<!-- src/components/render/FixtureStats.vue -->
<template>
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
          <PieChartMini :data="TotalFixturesData" width="50px" height="50px" />
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
          <BarChartMini :data="upcomingData" width="50px" height="30px" />
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
          <BarChartMini :data="resultsData" width="50px" height="30px" />
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
            :data="totalGradesData"
            width="50px"
            height="30px"
            barColor="#4CAF50"
          />
        </template>
      </CardSmall1DataPoint>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from "vue";

import CardSmall1DataPoint from "@/components/primitives/cards/CardSmall1DataPoint.vue";

import { useGradeData } from "@/pages/render/composables/useGradeData";
import { useUpcomingGameData } from "@/pages/render/composables/useUpcomingGameData";
import { useGameResultsInRenderData } from "@/pages/render/composables/useGameResultsInRenderData";
import LineChartMini from "@/components/charts/mini/LineChart.vue";
import PieChartMini from "@/components/charts/mini/PieChart.vue";
import BarChartMini from "@/components/charts/mini/BarChart.vue";

const { totalGrades } = useGradeData(); // Use the total grades directly
const { totalUpcomingGames } = useUpcomingGameData(); // Use the total upcoming games directly
const { totalGameResults } = useGameResultsInRenderData(); // Use the total game results directly

const TotalFixturesData = computed(() => [
  { value: totalUpcomingGames.value, name: "Upcoming" },
  { value: totalGameResults.value, name: "Results" },
]);
const upcomingData = computed(() => [
  totalUpcomingGames.value,
  totalGameResults.value,
]);
const resultsData = computed(() => [
  totalGameResults.value,
  totalUpcomingGames.value,
]);
const totalGradesData = computed(() => [totalGrades.value]);
</script>
