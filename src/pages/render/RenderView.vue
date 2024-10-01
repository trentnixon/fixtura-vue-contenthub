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
import { onMounted } from "vue";
import { useRoute } from "vue-router";

import HeaderSection from "@/pages/render/components/HeaderSection.vue";
import DownloadsStats from "@/pages/render/components/DownloadsStats.vue";

import { fetchFixturaRenderById } from "@/store/renders/actions";
const { fetchAccountById } = useAccountData();

import CategorySection from "@/pages/render/components/CategorySection.vue";

import CardHeader from "@/components/primitives/headers/CardHeader.vue";
import FixtureStats from "@/pages/render/components/FixtureStats.vue";
import { useAccountData } from "@/pages/account/composables/useAccountData";
/* import AssetCategoryStats from "@/pages/render/components/AssetCategoryStats.vue"; */

// Get route parameters
const route = useRoute();
const renderId = Number(route.params.renderid);
const accountId = Number(route.params.accountid);

onMounted(async () => {
  await fetchAccountById(accountId);
  await fetchFixturaRenderById(accountId, renderId);
});
</script>
