<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup>
/**
 * @file LineChart.vue
 * @description A reusable line chart component using Apache ECharts.
 * @example
 * <LineChart
 *   :data="[100, 200, 300, 400, 500]"
 *   :xAxisData="['Jan', 'Feb', 'Mar', 'Apr', 'May']"
 *   lineColor="#FF5722"
 *   :areaColor="{
 *     type: 'linear',
 *     colorStops: [
 *       { offset: 0, color: 'rgba(255,87,34,0.5)' },
 *       { offset: 1, color: 'rgba(255,87,34,0.1)' }
 *     ]
 *   }"
 *   :smooth="false"
 *   width="300px"
 *   height="150px"
 * />
 */
import { ref, onMounted, watch, onUnmounted, defineProps, computed } from "vue";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useEChartTheme } from "@/components/charts/composables/useEChartTheme";

echarts.use([LineChart, GridComponent, CanvasRenderer]);

const props = defineProps({
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "50px",
  },
  data: {
    type: Array,
    required: true,
  },
  xAxisData: {
    type: Array,
    default: () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  lineColor: {
    type: String,
    default: "#4CAF50",
  },
  areaColor: {
    type: Object,
    default: () => ({
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: "rgba(76,175,80,0.5)" },
        { offset: 1, color: "rgba(76,175,80,0.1)" },
      ],
    }),
  },
  smooth: {
    type: Boolean,
    default: true,
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
const themeColors = computed(() => getThemeColors());

const getLineColor = computed(() => props.lineColor || themeColors.value[0]);

const getAreaColor = computed(() => {
  if (props.areaColor) return props.areaColor;

  const baseColor = getLineColor.value;
  return {
    type: "linear",
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: `${baseColor}80` }, // 50% opacity
      { offset: 1, color: `${baseColor}1A` }, // 10% opacity
    ],
  };
});

const updateChart = () => {
  const option = {
    grid: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    xAxis: {
      type: "category",
      show: false,
      data: props.xAxisData,
    },
    yAxis: {
      type: "value",
      show: false,
    },
    series: [
      {
        data: props.data,
        type: "line",
        smooth: props.smooth,
        symbol: "none",
        lineStyle: {
          color: props.lineColor,
        },
        areaStyle: {
          color: getAreaColor,
        },
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
