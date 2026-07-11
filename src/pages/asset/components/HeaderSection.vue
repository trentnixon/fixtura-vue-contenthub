<template>
  <v-row>
    <v-col cols="12" sm="8">
      <MainHeader
        :title="getDisplayName(toPascalCase(asset))"
        :subtitle="`Render ${renderId}`"
      />
    </v-col>

    <!-- Edit button temporarily disabled -->
    <v-col
      class="d-flex justify-end"
      cols="12"
      sm="4"
      v-if="!$vuetify.display.xs"
    >
      <div
        class="d-flex justify-end my-4"
        v-if="
          asset !== 'CricketRoster' &&
          asset !== 'CricketResultSingle' &&
          !isBetaFeature
        "
      >
        <PrimaryButton
          color="success"
          label="Edit"
          @click="navigateToEdit()"
          :icon="icons.ui.edit"
          size="small"
        />
      </div>
    </v-col>
  </v-row>

  <!-- Beta Banner for Beta Features -->
  <BetaBanner :show="isBetaFeature" :messages="betaMessages" />
</template>
<script setup>
// vue
import { useRoute, useRouter } from "vue-router";
import { ref, watch, inject, computed } from "vue";
// composables
//import { useRenderData } from "@/pages/render/composables/useRenderData";
// Components
import MainHeader from "@/components/primitives/headers/MainHeader.vue";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import BetaBanner from "./BetaBanner.vue";
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

// Check if current asset is a beta feature
const isBetaFeature = computed(() => {
  const pascalAsset = toPascalCase(asset.value);
  return (
    pascalAsset === "CricketTeamOfTheWeek" ||
    pascalAsset === "CricketBattingPerformances" ||
    pascalAsset === "CricketBowlingPerformances"
  );
});

// Get beta messages based on asset type
const betaMessages = computed(() => {
  const pascalAsset = toPascalCase(asset.value);
  const featureName = getDisplayName(pascalAsset);

  if (pascalAsset === "CricketTeamOfTheWeek") {
    return [
      "Our Team of the Week is currently in testing, and we would love some feedback.",
      "If you have any issues or would like a change to the Team of the Week, please let us know.",
    ];
  }

  if (
    pascalAsset === "CricketBattingPerformances" ||
    pascalAsset === "CricketBowlingPerformances"
  ) {
    return [
      `${featureName} is currently in testing, and we would love some feedback.`,
      `If you have any issues or would like a change to ${featureName}, please let us know.`,
    ];
  }

  return [
    "This feature is currently in testing, and we would love some feedback.",
    "If you have any issues or would like a change, please let us know.",
  ];
});

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
