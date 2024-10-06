<template>
  <template v-if="groupingCategory">
    <v-menu
      v-model="isMenuOpen"
      close-on-content-click
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ props }">
        <v-btn class="mr-2" v-bind="props" variant="tonal" color="primary"
          ><span v-if="$vuetify.display.smAndDown">Assets</span>
          <span v-else
            >{{
              groupingCategory.length > 20
                ? groupingCategory.slice(0, 20) + "[...]"
                : groupingCategory
            }}
            Assets</span
          ></v-btn
        >
      </template>

      <v-list>
        <v-list-item
          v-for="asset in sortedAssets"
          :key="asset.type"
          @click="navigateToAsset(asset.type)"
          :active="isActiveAssetType(asset.type)"
        >
          <v-list-item-title>{{
            getDisplayName(asset.type.toLowerCase())
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </template>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useRenderGroupingData } from "@/pages/grouping/composables/useRenderGroupingData";
import { useGlobalComposable } from "@/utils/useGlobalComposable";

const router = useRouter();
const route = useRoute();

const accountId = ref(Number(route.params.accountid));
const renderId = ref(Number(route.params.renderid));
const sport = ref(route.params.sport);
const groupingCategory = ref(route.params.groupingcategory);
const assetType = ref(route.params.asset);

const isMenuOpen = ref(false);
const { getAssetsByType } = useRenderGroupingData();
const { getDisplayName } = useGlobalComposable();

const assetOrder = [
  "WeekendResults",
  "WeekendSingleGameResult",
  "Top5BattingList",
  "Top5BowlingList",
  "Ladder",
  "UpComingFixtures",
];

const isActiveAssetType = computed(() => (type) => {
  return type.toLowerCase() === assetType.value?.toLowerCase();
});

const sortedAssets = computed(() => {
  return Object.entries(getAssetsByType.value)
    .map(([type, stats]) => ({
      type,
      downloadCount: stats.downloads,
      articleCount: stats.aiArticles,
      link: getCategoryLink(type),
    }))
    .sort((a, b) => assetOrder.indexOf(a.type) - assetOrder.indexOf(b.type));
});

function getCategoryLink(type) {
  return `/${accountId.value}/${sport.value}/${renderId.value}/${
    groupingCategory.value
  }/${type.toLowerCase()}`;
}

function navigateToAsset(type) {
  isMenuOpen.value = false;
  router.push(
    `/${accountId.value}/${sport.value}/${renderId.value}/${
      groupingCategory.value
    }/${type.toLowerCase()}`
  );
}
// Add watch function for route params
watch(
  () => route.params,
  (newParams) => {
    accountId.value = Number(newParams.accountid);
    renderId.value = Number(newParams.renderid);
    sport.value = newParams.sport;
    groupingCategory.value = newParams.groupingcategory;
    assetType.value = newParams.asset;
  },
  { deep: true }
);
</script>
