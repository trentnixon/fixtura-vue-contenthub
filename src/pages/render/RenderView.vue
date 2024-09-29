<template>
  <v-container fluid class="pa-0">
    <HeaderSection />
    <v-divider class="my-4" />
    <CategorySection />
    <v-divider class="my-4 py-4" />

    <CardHeader
      title="Fixture Statistics"
      subtitle="Overview of your bundle's fixtures and results"
    />
    <FixtureStats />
    <v-divider class="my-4 py-4" />
    <CardHeader title="Download Statistics" subtitle="Overall Downloads" />
    <DownloadsStats />
    <v-divider class="my-4 py-4" />
  </v-container>
</template>

<script setup>
import HeaderSection from "@/pages/render/components/HeaderSection.vue";
import DownloadsStats from "@/pages/render/components/DownloadsStats.vue";
import { fetchDownloadsByRenderId } from "@/store/downloads/actions";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchAiArticlesByRenderId } from "@/store/aiArticles/actions";
import { fetchRenderById } from "@/store/renders/actions";
import { fetchGameResultsInRenderByRenderId } from "@/store/gameResultsInRenderStore/actions";
import { fetchGradesByRenderId } from "@/store/gradesInRender/actions";
import { fetchUpcomingGamesByRenderId } from "@/store/upcomingGamesInRender/actions";
import CategorySection from "@/pages/render/components/CategorySection.vue";
import FixtureStats from "@/pages/render/components/FixtureStats.vue";
import CardHeader from "@/components/primitives/headers/CardHeader.vue";
import { useAccountData } from "@/pages/account/composables/useAccountData";
//const route = useRoute();
//const renderId = route.params.renderid;
// Get route parameters
const route = useRoute();
const renderId = Number(route.params.renderid);
const accountId = Number(route.params.accountid);
const { fetchAccountById } = useAccountData();

onMounted(async () => {
  await fetchAccountById(accountId);
  await fetchDownloadsByRenderId(renderId);
  await fetchAiArticlesByRenderId(renderId);
  await fetchRenderById(renderId);
  await fetchGameResultsInRenderByRenderId(renderId);
  await fetchGradesByRenderId(renderId);
  await fetchUpcomingGamesByRenderId(renderId);
});
</script>
