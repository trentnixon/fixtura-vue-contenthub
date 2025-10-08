<template>
  <v-row>
    <v-col cols="12" sm="8">
      <MainHeader :title="getDisplayName(toPascalCase(asset))" :subtitle="`Render ${renderId}`" />
    </v-col>

    <!-- Edit button temporarily disabled -->
    <!-- <v-col class="d-flex justify-end" cols="12" sm="4" v-if="!$vuetify.display.xs">
      <div class="d-flex justify-end my-4" v-if="asset !== 'CricketRoster'">
        <PrimaryButton color="success" label="Edit" @click="navigateToEdit()" :icon="icons.ui.edit" size="small" />
      </div>
    </v-col> -->
  </v-row>
</template>
<script setup>
// vue
import { useRoute, useRouter } from "vue-router";
import { ref, watch, inject } from "vue";
// composables
//import { useRenderData } from "@/pages/render/composables/useRenderData";
// Components
import MainHeader from "@/components/primitives/headers/MainHeader.vue";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import { useGlobalComposable } from "@/utils/useGlobalComposable";
const icons = inject("icons");
const router = useRouter();
const route = useRoute();
const asset = ref(route.params.asset);
//const groupingCategory = ref(route.params.groupingcategory);
//const accountid = ref(Number(route.params.accountid));
const renderId = ref(Number(route.params.renderid));
//const sport = ref(route.params.sport);
//const { getRenderTime } = useRenderData();

const { getDisplayName } = useGlobalComposable();

watch(
  () => route.params,
  (newParams) => {
    asset.value = newParams.asset;
  }
);

function toPascalCase(str) {
  return str
    .replace(/(^|_|-|\s)+(\w)/g, (_, __, c) => c.toUpperCase())
    .replace(/^(\w)/, (c) => c.toUpperCase());
}

function navigateToEdit() {
  console.log("Navigating with params:", {
    accountid: route.params.accountid,
    sport: route.params.sport,
    renderid: route.params.renderid,
    groupingcategory: route.params.groupingcategory,
    asset: route.params.asset,
  });
  router.push({
    name: "processEdit",
    query: {
      accountid: route.params.accountid,
      sport: route.params.sport,
      renderid: route.params.renderid,
      groupingcategory: route.params.groupingcategory,
      asset: route.params.asset,
    },
  });
}
</script>
