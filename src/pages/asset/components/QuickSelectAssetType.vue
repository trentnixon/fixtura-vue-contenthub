<template>
  <v-menu
    v-model="isMenuOpen"
    close-on-content-click
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" outlined color="primary"> Quick Select </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="asset in assetTypes"
        :key="asset.type"
        @click="navigateToAsset(asset.type)"
      >
        <v-list-item-title>{{ getDisplayName(asset.type) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useGroupedAssetsData } from "@/pages/grouping/composables/useGroupedAssetsData";
import { useGlobalComposable } from "@/utils/useGlobalComposable"; // Importing global composable

// Router and Route composables
const router = useRouter();
const route = useRoute();

// Reactive state for selected asset and menu visibility
const isMenuOpen = ref(false);

// Reactive route parameters
const groupingCategory = ref(route.params.groupingcategory || "");
const accountid = ref(Number(route.params.accountid));
const renderId = ref(Number(route.params.renderid));
const sport = ref(route.params.sport);

// Fetching data from the composable
let { loading, getAssetTypeWithIds } = useGroupedAssetsData(
  groupingCategory.value,
  route.params.renderid
);

// Using global composable to get display names for assets
const { getDisplayName } = useGlobalComposable();

// Computed property to get unique asset types
const assetTypes = computed(() => {
  const uniqueTypes = [];
  getAssetTypeWithIds.value.forEach((asset) => {
    if (!uniqueTypes.some((type) => type.type === asset.type)) {
      uniqueTypes.push({ type: asset.type });
    }
  });
  return uniqueTypes;
});

// Function to navigate to the selected asset type
function navigateToAsset(type) {
  isMenuOpen.value = false; // Close the menu
  // Construct the URL based on the route params and selected type
  router.push({
    path: `/${accountid.value}/${sport.value}/${renderId.value}/${groupingCategory.value}/${type}`,
  });
}
</script>
