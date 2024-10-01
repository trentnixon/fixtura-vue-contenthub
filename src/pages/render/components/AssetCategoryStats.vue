<template>
  <v-row
    class="d-flex justify-center"
    v-if="renderMetrics && renderMetrics.assetCategorySplit"
  >
    <!-- Video Category -->
    <v-col cols="4">
      <CardSmall1DataPoint
        icon="mdi-video"
        buttonText=""
        :value="getCategoryTotal('video')"
        subtitle="Video Assets"
        theme="cardNeutral"
      >
        <template v-slot:chart>
          <PieChartMini
            :data="getCategoryChartData('video')"
            width="50px"
            height="50px"
          />
        </template>
      </CardSmall1DataPoint>
    </v-col>

    <!-- Image Category -->
    <v-col cols="4">
      <CardSmall1DataPoint
        icon="mdi-image"
        buttonText=""
        :value="getCategoryTotal('image')"
        subtitle="Image Assets"
        theme="cardNeutral"
      >
        <template v-slot:chart>
          <PieChartMini
            :data="getCategoryChartData('image')"
            width="50px"
            height="50px"
          />
        </template>
      </CardSmall1DataPoint>
    </v-col>

    <!-- Writeup Category -->
    <v-col cols="4">
      <CardSmall1DataPoint
        icon="mdi-file-document"
        buttonText=""
        :value="getCategoryTotal('writeup')"
        subtitle="Writeup Assets"
        theme="cardNeutral"
      >
        <template v-slot:chart>
          <PieChartMini
            :data="getCategoryChartData('writeup')"
            width="50px"
            height="50px"
          />
        </template>
      </CardSmall1DataPoint>
    </v-col>
  </v-row>

  <!-- Loading spinner while metrics data is not available -->
  <div v-else class="text-center">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
</template>

<script setup>
import CardSmall1DataPoint from "@/components/primitives/cards/CardSmall1DataPoint.vue";
import PieChartMini from "@/components/charts/mini/PieChart.vue";
import { computed } from "vue";
import { useRenderData } from "@/pages/render/composables/useRenderData";

// Extract renderMetrics from the composable
const { renderMetrics } = useRenderData();

// Function to calculate the total assets for a given category (video, image, writeup)
const getCategoryTotal = (category) => {
  const categoryData = renderMetrics.value.assetCategorySplit[category];
  return (categoryData.results || 0) + (categoryData.upcoming || 0);
};

// Function to generate chart data for a given category (results vs. upcoming)
const getCategoryChartData = (category) => {
  const categoryData = renderMetrics.value.assetCategorySplit[category];
  return [
    { value: categoryData.results || 0, name: "Results" },
    { value: categoryData.upcoming || 0, name: "Upcoming" },
  ];
};
</script>
