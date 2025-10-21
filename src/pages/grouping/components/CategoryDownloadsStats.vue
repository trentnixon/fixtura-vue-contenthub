<template>
  <v-row class="d-flex justify-center">
    <!-- Downloads Card -->
    <v-col cols="6" md="3">
      <CardSmall1DataPoint :icon="icons.assets.download" buttonText="" :value="getSelectedCategoryStats?.downloads || 0"
        subtitle="Total Downloads" theme="cardNeutral" />
    </v-col>

    <!-- Videos Card -->
    <v-col cols="6" md="3">
      <CardSmall1DataPoint :icon="icons.media.video" buttonText="" :value="getSelectedCategoryStats?.videos || 0"
        subtitle="Total Videos" theme="cardNeutral" />
    </v-col>

    <!-- Images Card -->
    <v-col cols="6" md="3">
      <CardSmall1DataPoint :icon="icons.assets.image" buttonText="" :value="getSelectedCategoryStats?.images || 0"
        subtitle="Total Images" theme="cardNeutral" />
    </v-col>

    <!-- Articles Card -->
    <v-col cols="6" md="3">
      <CardSmall1DataPoint :icon="icons.assets.articles" buttonText=""
        :value="getSelectedCategoryStats?.aiWriteups || 0" subtitle="Total Articles" theme="cardNeutral" />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch, inject } from "vue";
import { useRoute } from "vue-router";
import CardSmall1DataPoint from "@/components/primitives/cards/CardSmall1DataPoint.vue";
import { useRenderGroupingData } from "@/pages/grouping/composables/useRenderGroupingData";
const icons = inject("icons");
// Get route parameters
const route = useRoute();
const groupingCategory = ref(decodeURIComponent(String(route.params.groupingcategory)));

// Extract stats from the composable
const { getSelectedCategoryStats } = useRenderGroupingData();

console.log("[getSelectedCategoryStats]", getSelectedCategoryStats)
// Watch for route parameter changes
watch(
  () => route.params.groupingcategory,
  (newCategory) => {
    groupingCategory.value = decodeURIComponent(String(newCategory));
  }
);
</script>
