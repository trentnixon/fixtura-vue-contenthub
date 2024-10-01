<template>
  <HeaderSection />
  <v-divider class="my-4" />
  <!-- Display download stats for the grouping category -->

  <AssetTableByType />
  <v-divider class="my-4" />
  <CardHeader
    :title="`${groupingCategory} render statistics`"
    subtitle="Download breakdown"
  />
  <CategoryDownloadsStats :groupingCategory="groupingCategory" />
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
import HeaderSection from "@/pages/grouping/components/HeaderSection.vue";
import CategoryDownloadsStats from "@/pages/grouping/components/CategoryDownloadsStats.vue";
import AssetTableByType from "@/pages/grouping/components/AssetTableByType.vue";
import CardHeader from "@/components/primitives/headers/CardHeader.vue";
import { useAccountData } from "@/pages/account/composables/useAccountData";

import { fetchFixturaRenderById } from "@/store/renders/actions";
import { useRendersStore } from "@/store/renders";
const { fetchAccountById } = useAccountData();
const { fetchGroupingDetails } = useRendersStore();
// Get route parameters
const route = useRoute();
const renderId = Number(route.params.renderid);
const accountId = Number(route.params.accountid);

const groupingCategory = ref(route.params.groupingcategory);
watch(
  () => route.params,
  (newParams) => {
    groupingCategory.value = newParams.groupingcategory;
  }
);

onMounted(async () => {
  await fetchAccountById(accountId);
  await fetchFixturaRenderById(accountId, renderId);
  await fetchGroupingDetails(accountId, renderId, groupingCategory.value);
});
</script>
