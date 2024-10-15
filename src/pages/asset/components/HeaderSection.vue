<template>
  <v-row>
    <v-col cols="12" sm="8">
      <MainHeader :title="getDisplayName(asset)" :subtitle="`Render ${renderId}`" />
    </v-col>

    <v-col class="d-flex justify-end" cols="12" sm="4" v-if="!$vuetify.display.xs">
      <CustomChip :label="groupingCategory" :value="groupingCategory" type="boolean" />
      <CustomChip :label="sport" :value="sport" type="boolean" />
    </v-col>
  </v-row>
</template>
<script setup>
// vue
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
// composables
import { useRenderData } from "@/pages/render/composables/useRenderData";
// Components
import MainHeader from "@/components/primitives/headers/MainHeader.vue";
import CustomChip from "@/components/primitives/chips/CustomChip.vue";

const route = useRoute();
const asset = ref(route.params.asset);
const groupingCategory = ref(route.params.groupingcategory);
//const accountid = ref(Number(route.params.accountid));
const renderId = ref(Number(route.params.renderid));
const sport = ref(route.params.sport);

const { getRenderTime } = useRenderData();

watch(
  () => route.params,
  (newParams) => {
    asset.value = newParams.asset;
  }
);

function getDisplayName(type) {
  const names = {
    weekendresults: "Weekend Results",
    ladder: "Ladder",
    top5bowlinglist: "Top 5 Bowling",
    top5battinglist: "Top 5 Batting",
    upcomingfixtures: "Upcoming Fixtures",
    weekendsinglegameresult: "Single Game Result",
    rosterposter: "Team Rosters",
  };
  return names[type] || type;
}
</script>
