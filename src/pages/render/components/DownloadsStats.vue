<template>
  <v-row class="d-flex justify-center" v-if="renderMetrics && renderMetrics.summary">
    <!-- Total Downloads -->
    <v-col cols="6" md="4">
      <CardSmall1DataPoint icon="mdi-download" buttonText="" :value="renderMetrics.summary.totalDownloads"
        subtitle="Total Downloads" theme="cardNeutral" />
    </v-col>

    <!-- Total AI Articles -->
    <v-col cols="6" md="4">
      <CardSmall1DataPoint icon="mdi-file-document" buttonText="" :value="renderMetrics.summary.totalAiArticles"
        subtitle="Total Articles" theme="cardNeutral" />
    </v-col>

    <!-- Errors -->
    <v-col cols="12" md="4">
      <CardSmall1DataPoint icon="mdi-alert-circle" buttonText="" :value="renderMetrics.summary.totalErrors"
        subtitle="Errors" :theme="renderMetrics.summary.totalErrors > 0 ? 'cardError' : 'cardNeutral'
          " />
    </v-col>
  </v-row>

  <!-- Loading spinner while metrics data is not available -->
  <div v-else class="text-center">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
</template>

<script setup>
import CardSmall1DataPoint from "@/components/primitives/cards/CardSmall1DataPoint.vue";
import { computed } from "vue";
import { useRenderData } from "@/pages/render/composables/useRenderData";

// Extract renderMetrics from the composable
const { renderMetrics } = useRenderData();

// You can now directly use the renderMetrics object for the stats
</script>
