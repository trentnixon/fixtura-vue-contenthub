<template>
  <v-menu
    v-if="renderId"
    v-model="isMenuOpen"
    close-on-content-click
    transition="slide-y-transition"
  >
    <template #activator="{ props }">
      <v-btn class="mr-2" v-bind="props" variant="tonal" color="primary">
        <span v-if="$vuetify.display.smAndDown">Categories</span>
        <span v-else>{{ useVerb }} Category</span>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="asset in filteredCategoryItems"
        :key="asset.category"
        @click="navigateToAsset(asset.category)"
        :active="isActiveCategory(asset.category)"
      >
        <v-list-item-title>
          {{ getDisplayName(asset.category) }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useGlobalComposable } from "@/utils/useGlobalComposable";
import { useRenderData } from "@/pages/render/composables/useRenderData";

const router = useRouter();
const route = useRoute();
const { filteredCategoryItems } = useRenderData();
const { getDisplayName } = useGlobalComposable();

const accountId = ref(Number(route.params.accountid));
const renderId = ref(Number(route.params.renderid));
const sport = ref(route.params.sport);
const groupingCategory = ref(route.params.groupingcategory);
const isMenuOpen = ref(false);

const useVerb = computed(() => {
  return groupingCategory.value ? "Change" : "Select";
});

const isActiveCategory = computed(() => (category) => {
  return category.toLowerCase() === groupingCategory.value?.toLowerCase();
});

function navigateToAsset(type) {
  isMenuOpen.value = false;
  router.push(
    `/${accountId.value}/${sport.value}/${renderId.value}/${type.toLowerCase()}`
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
  },
  { deep: true }
);
</script>
