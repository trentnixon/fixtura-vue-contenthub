<template>
  <HeaderSection />
  <v-divider class="my-4" />
  <!-- Display download stats for the grouping category -->

  <AssetTableByType />
  <v-divider class="my-4" />
  <CardHeader
    :title="`${groupingCategory} download statistics`"
    subtitle="Download breakdown"
  />
  <CategoryDownloadsStats :groupingCategory="groupingCategory" />
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
import HeaderSection from "@/pages/grouping/components/HeaderSection.vue";
import CategoryDownloadsStats from "@/pages/grouping/components/CategoryDownloadsStats.vue";
import AssetTableByType from "@/pages/grouping/components/AssetTableByType.vue";
import CardHeader from "@/components/primitives/headers/CardHeader.vue";

const route = useRoute();
const groupingCategory = ref(route.params.groupingcategory);

watch(
  () => route.params,
  (newParams) => {
    groupingCategory.value = newParams.groupingcategory;
  }
);
</script>
