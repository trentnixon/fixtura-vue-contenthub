<template>
  <v-container fluid class="pa-0">
    <HeaderSection />
    <v-divider class="my-4" />

    <CategorySection />
    <v-divider class="my-4 py-4" />
    <CardHeader title="The Numbers" subtitle="This weeks Bundle status" />
    <DownloadsStats />
    <!--     <AssetCategoryStats /> -->
    <v-divider class="my-4 py-4" />
    <CardHeader
      title="Fixture Statistics"
      subtitle="Overview of your bundle's fixtures and results"
    />
    <FixtureStats />
    <v-divider class="my-4 py-4" />
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import HeaderSection from "@/pages/render/components/HeaderSection.vue";
import DownloadsStats from "@/pages/render/components/DownloadsStats.vue";
import CategorySection from "@/pages/render/components/CategorySection.vue";
import CardHeader from "@/components/primitives/headers/CardHeader.vue";
import FixtureStats from "@/pages/render/components/FixtureStats.vue";
import { useAccountData } from "@/pages/account/composables/useAccountData";
import { fetchFixturaRenderById } from "@/store/renders/actions";

// Initialize account and render fetching
const { fetchAccountById } = useAccountData();

// Reactive route parameters
const route = useRoute();
const renderId = ref(Number(route.params.renderid));
const accountId = ref(Number(route.params.accountid));

// Function to fetch the necessary data
async function fetchData() {
  await fetchAccountById(accountId.value);
  await fetchFixturaRenderById(accountId.value, renderId.value);
}

// Fetch data on component mount
onMounted(() => {
  fetchData();
});

// Watch for route parameter changes and refetch data
watch(
  () => route.params,
  (newParams) => {
    accountId.value = Number(newParams.accountid);
    renderId.value = Number(newParams.renderid);
    fetchData(); // Trigger refetch when route parameters change
  }
);
</script>
