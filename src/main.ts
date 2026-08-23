import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import {
  bootstrapAnalyticsIdentity,
  initAnalytics,
} from "@/lib/analytics";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { createPinia } from "pinia";
import { IconPlugin } from "./plugins/PluginIcons";
import "@mdi/font/css/materialdesignicons.css";
import "./assets/styles/variables.scss";
import "./assets/styles/utilities.scss";
// ECharts imports
import VChart, { THEME_KEY } from "vue-echarts";
import * as echarts from "echarts";
import customTheme from "@/theme/echart-theme";
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

// Register the custom theme
echarts.registerTheme("customTheme", customTheme);

// Use the necessary ECharts components
use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
]);

loadFonts();

async function bootstrapApp() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(router);
  app.use(vuetify);
  app.use(pinia);
  app.use(IconPlugin);
  app.component("v-chart", VChart);

  initAnalytics();
  await bootstrapAnalyticsIdentity();

  app.provide(THEME_KEY, "customTheme");
  app.mount("#app");
}

void bootstrapApp();
