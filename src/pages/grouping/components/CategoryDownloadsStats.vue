<template>
  <v-row class="d-flex justify-center">
    <!-- Total Fixtures Card -->
    <v-col cols="12" md="4">
      <CardSmall1DataPoint
        icon="mdi-calendar"
        buttonText=""
        :value="getTotalFixtures"
        subtitle="Total Fixtures"
        theme="cardNeutral"
      />
    </v-col>
    <!-- Total Game Results Card -->
    <v-col cols="12" md="4">
      <CardSmall1DataPoint
        icon="mdi-soccer"
        buttonText=""
        :value="getTotalGameResults"
        subtitle="Game Results"
        theme="cardNeutral"
      />
    </v-col>

    <!-- Total Upcoming Games Card -->
    <v-col cols="12" md="4">
      <CardSmall1DataPoint
        icon="mdi-clock"
        buttonText=""
        :value="getTotalUpcomingGames"
        subtitle="Upcoming Games"
        theme="cardNeutral"
      />
    </v-col>
    <!-- Total Downloads Card -->
    <v-col cols="12" md="6">
      <CardSmall1DataPoint
        icon="mdi-download"
        buttonText=""
        :value="getTotalDownloads"
        subtitle="Total Downloads"
        theme="cardNeutral"
      />
    </v-col>

    <!-- Total Articles Card -->
    <v-col cols="12" md="6">
      <CardSmall1DataPoint
        icon="mdi-file-document"
        buttonText=""
        :value="getTotalAiArticles"
        subtitle="Total AI Articles"
        theme="cardNeutral"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import CardSmall1DataPoint from "@/components/primitives/cards/CardSmall1DataPoint.vue";
import { useRenderGroupingData } from "@/pages/grouping/composables/useRenderGroupingData";

// Get route parameters
const route = useRoute();
const groupingCategory = ref(route.params.groupingcategory);

// Extract stats from the composable
const {
  getTotalDownloads,
  getTotalAiArticles,
  getTotalGameResults,
  getTotalUpcomingGames,
  getTotalGrades,
  getTotalFixtures,
  checkBundleErrors,
} = useRenderGroupingData();

// Watch for route parameter changes
watch(
  () => route.params.groupingcategory,
  (newCategory) => {
    groupingCategory.value = newCategory;
  }
);
</script>
