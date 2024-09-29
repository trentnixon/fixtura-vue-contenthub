<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup>
/**
 * @file BarChart.vue
 * @description A reusable mini bar chart component using Apache ECharts.
 * @example
 * <BarChart
 *   :data="[120, 200, 150, 80, 70, 110, 130]"
 *   :xAxisData="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
 *   barColor="#36A2EB"
 *   width="100px"
 *   height="50px"
 * />
 */

import { ref, onMounted, watch, onUnmounted, defineProps } from "vue";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useEChartTheme } from "@/components/charts/composables/useEChartTheme";

echarts.use([BarChart, GridComponent, CanvasRenderer]);

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
    default: "50px",
  },
  /**
   * Data for the chart. An array of numbers representing bar heights.
   * @type {number[]}
   * @required
   */
  data: {
    type: Array,
    required: true,
  },
  /**
   * Labels for the x-axis
   * @type {string[]}
   */
  xAxisData: {
    type: Array,
    default: () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  /**
   * Color of the bars
   * @type {string}
   */
  barColor: {
    type: String,
    default: "#36A2EB",
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
    grid: {
      top: "5%",
      right: "1%",
      bottom: "5%",
      left: "1%",
      containLabel: false,
    },
    xAxis: {
      type: "category",
      data: props.xAxisData,
      show: false,
    },
    yAxis: {
      type: "value",
      show: false,
    },
    series: [
      {
        data: props.data,
        type: "bar",
        itemStyle: {
          color: themeColors[0],
        },
        barWidth: "60%",
      },
    ],
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

<!--
## Usage

This BarChart component creates a simple, customizable mini bar chart using Apache ECharts.

### Props

- `width` (String, default: '100%'): Width of the chart.
- `height` (String, default: '50px'): Height of the chart.
- `data` (Array, required): An array of numbers representing the heights of the bars.
- `xAxisData` (Array, default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']): Labels for the x-axis.
- `barColor` (String, default: '#36A2EB'): Color of the bars.

### Example

```vue
<template>
  <BarChart
    :data="[120, 200, 150, 80, 70, 110, 130]"
    :xAxisData="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
    barColor="#36A2EB"
    width="100px"
    height="50px"
  />
</template>

<script setup>
import BarChart from '@/components/charts/BarChart.vue';
</script>
```

This will create a mini bar chart with custom data, x-axis labels, and bar color.

Note: Make sure to import and register the BarChart component in your Vue file before using it.
-->
