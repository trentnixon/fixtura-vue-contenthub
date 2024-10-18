<template>
  <HeaderSection />
  <v-divider class="my-4" />
  <!-- Display download stats for the grouping category -->
  <AssetTableByType />
  <v-divider class="my-4" />
  <CardHeader :title="`${groupingCategory} render statistics`" subtitle="Download breakdown" />
  <CategoryDownloadsStats :groupingCategory="groupingCategory" />
  <!--   <v-divider class="my-4" />
  <CardHeader :title="`${groupingCategory} Fixtures`" subtitle="The fixtures were used when creating the render" /> -->
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

// Initialize composables
const { fetchAccountById } = useAccountData();
const { fetchGroupingDetails } = useRendersStore();

// Get route parameters
const route = useRoute();
const renderId = ref(Number(route.params.renderid));
const accountId = ref(Number(route.params.accountid));
const groupingCategory = ref(route.params.groupingcategory);

// Function to fetch data based on route parameters
async function fetchData() {
  await fetchAccountById(accountId.value);
  await fetchFixturaRenderById(accountId.value, renderId.value);
  await fetchGroupingDetails(
    accountId.value,
    renderId.value,
    groupingCategory.value
  );
}

// Fetch data on component mount
onMounted(() => {
  fetchData();
});

// Watch for route changes and refetch data
watch(
  () => route.params,
  (newParams) => {
    accountId.value = Number(newParams.accountid);
    renderId.value = Number(newParams.renderid);
    groupingCategory.value = newParams.groupingcategory;
    fetchData(); // Refetch data when route changes
  }
);
</script>
