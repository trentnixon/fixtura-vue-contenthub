<template>
  <v-row class="d-flex justify-center">
    <!-- Downloads Card -->
    <v-col cols="12" md="3">
      <CardSmall1DataPoint
        icon="mdi-download"
        buttonText=""
        :value="getSelectedCategoryStats?.downloads || 0"
        subtitle="Total Downloads"
        theme="cardNeutral"
      />
    </v-col>

    <!-- Videos Card -->
    <v-col cols="12" md="3">
      <CardSmall1DataPoint
        icon="mdi-video"
        buttonText=""
        :value="getSelectedCategoryStats?.videos || 0"
        subtitle="Total Videos"
        theme="cardNeutral"
      />
    </v-col>

    <!-- Images Card -->
    <v-col cols="12" md="3">
      <CardSmall1DataPoint
        icon="mdi-image"
        buttonText=""
        :value="getSelectedCategoryStats?.images || 0"
        subtitle="Total Images"
        theme="cardNeutral"
      />
    </v-col>

    <!-- Articles Card -->
    <v-col cols="12" md="3">
      <CardSmall1DataPoint
        icon="mdi-file-document-outline"
        buttonText=""
        :value="getSelectedCategoryStats?.aiWriteups || 0"
        subtitle="Total Articles"
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
const { getSelectedCategoryStats } = useRenderGroupingData();

// Watch for route parameter changes
watch(
  () => route.params.groupingcategory,
  (newCategory) => {
    groupingCategory.value = newCategory;
  }
);
</script>
