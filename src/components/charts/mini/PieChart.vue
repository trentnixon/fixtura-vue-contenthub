<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup>
/**
 * @file PieChart.vue
 * @description A reusable mini pie chart component using Apache ECharts.
 * @example
 * <PieChart
 *   :data="[
 *     { value: 1048, name: 'Search Engine' },
 *     { value: 735, name: 'Direct' },
 *     { value: 580, name: 'Email' },
 *     { value: 484, name: 'Union Ads' },
 *     { value: 300, name: 'Video Ads' }
 *   ]"
 *   :colors="['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']"
 *   width="100px"
 *   height="100px"
 * />
 */

import { ref, onMounted, watch, onUnmounted, defineProps } from "vue";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useEChartTheme } from "@/components/charts/composables/useEChartTheme";

echarts.use([PieChart, LegendComponent, CanvasRenderer]);

const props = defineProps({
  /**
   * Width of the chart
   * @type {string}
   */
  width: {
    type: String,
    default: "100%",
  },
  /**
   * Height of the chart
   * @type {string}
   */
  height: {
    type: String,
    default: "100px",
  },
  /**
   * Data for the chart. An array of objects with 'value' and 'name' properties.
   * @type {Array<{value: number, name: string}>}
   * @required
   */
  data: {
    type: Array,
    required: true,
  },
  /**
   * Array of colors for the pie slices
   * @type {string[]}
   */
  colors: {
    type: Array,
    default: null,
  },
  /**
   * Whether to show the legend
   * @type {boolean}
   */
  showLegend: {
    type: Boolean,
    default: false,
  },
});

const chartRef = ref(null);
let chart = null;
const { getThemeColors } = useEChartTheme();

const initChart = () => {
  if (chart) {
    chart.dispose();
  }
  chart = echarts.init(chartRef.value);
  updateChart();
};

const updateChart = () => {
  const themeColors = getThemeColors();
  const option = {
    color: themeColors,
    series: [
      {
        type: "pie",
        radius: "90%",
        center: ["50%", "50%"],
        data: props.data,
        label: {
          show: false,
        },
      },
    ],
    legend: {
      show: props.showLegend,
      orient: "vertical",
      left: "left",
    },
  };
  chart.setOption(option);
};

onMounted(() => {
  initChart();
});

watch(
  () => props.data,
  () => {
    updateChart();
  }
);

// Cleanup
onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
});
</script>
