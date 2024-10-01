<template>
  <!-- Loading with a different type -->
  <LoadingSpinner v-if="loading || !metricsOverTime" type="paragraph" />

  <!-- Error Message -->
  <ErrorMessage v-else-if="error" :message="error" />

  <template v-else>
    <v-row class="d-flex justify-center">
      <!-- Total Digital Assets Card with Pie Chart -->
      <v-col cols="4" md="3">
        <CardSmall1DataPoint
          icon="mdi-chart-pie"
          buttonText=""
          :value="totalDigitalAssets"
          subtitle="Digital Assets Created"
          theme="cardNeutral"
        >
          <template v-slot:chart>
            <PieChartMini :data="totalAssetsData" width="50px" height="50px" />
          </template>
        </CardSmall1DataPoint>
      </v-col>

      <!-- Total Downloads Card -->
      <v-col cols="4" md="3">
        <CardSmall1DataPoint
          icon="mdi-download"
          buttonText=""
          :value="totalDownloads"
          subtitle="Total Downloads"
          theme="cardNeutral"
        >
          <template v-slot:chart>
            <BarChartMini :data="downloadsArr" width="80px" height="50px" />
          </template>
          <template v-slot:extra>
            <div>
              <p>
                <strong>Percentage Downloads:</strong>
                {{ percentageDownloads }}%
              </p>
            </div>
          </template>
        </CardSmall1DataPoint>
      </v-col>

      <!-- AI Articles Card -->
      <v-col cols="4" md="3">
        <CardSmall1DataPoint
          icon="mdi-newspaper"
          buttonText=""
          :value="totalAiArticles"
          subtitle="Articles written"
          theme="cardNeutral"
        >
          <template v-slot:chart>
            <BarChartMini :data="aiArticlesArr" width="80px" height="50px" />
          </template>
          <template v-slot:extra>
            <div>
              <p>
                <strong>Percentage AI Articles:</strong>
                {{ percentageAiArticles }}%
              </p>
            </div>
          </template>
        </CardSmall1DataPoint>
      </v-col>

      <!-- Average Price per Asset Card with Bar Chart -->
      <v-col cols="4" md="3">
        <CardSmall1DataPoint
          icon="mdi-currency-usd"
          buttonText=""
          :value="`$${averageCostPerDigitalAsset.toFixed(2)}`"
          subtitle="Price per Asset"
          theme="cardNeutral"
        >
          <template v-slot:chart>
            <BarChartMini
              :data="averageCostOverTimeArr"
              width="80px"
              height="50px"
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
const { metricsOverTime, metricsAsPercentageOfCost, loading, error } =
  useAccountData();

// Extract values from metricsOverTime
const totalDownloads = computed(() => metricsOverTime.value.totalDownloads);
const totalAiArticles = computed(() => metricsOverTime.value.totalAiArticles);
const totalDigitalAssets = computed(
  () => metricsAsPercentageOfCost.value.totalDigitalAssets
);

// Chart data for individual arrays
const downloadsArr = computed(() => metricsOverTime.value.DownloadsArr);
const aiArticlesArr = computed(() => metricsOverTime.value.AiArticlesArr);

// Pie chart data for total assets split between downloads and AI articles
const totalAssetsData = computed(() => [
  { value: totalDownloads.value, name: "Downloads" },
  { value: totalAiArticles.value, name: "AI Articles" },
]);

// Extract percentage metrics and cost-related data from metricsAsPercentageOfCost
const percentageDownloads = computed(
  () => metricsAsPercentageOfCost.value.percentageDownloads
);
const percentageAiArticles = computed(
  () => metricsAsPercentageOfCost.value.percentageAiArticles
);

// Extract average cost per digital asset and the average cost over time (as a bar chart)
const averageCostPerDigitalAsset = computed(
  () => metricsAsPercentageOfCost.value.averageCostPerDigitalAsset
);
const averageCostOverTimeArr = computed(
  () => metricsAsPercentageOfCost.value.averageCostOverTime
);
</script>
