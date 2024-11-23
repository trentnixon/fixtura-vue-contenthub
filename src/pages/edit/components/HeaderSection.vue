<template>
  <v-row>
    <v-col cols="8">
      <MainHeader
        :title="title"
        :subtitle="`Edit your ${assetEditComponents[assetType]}`"
      />
    </v-col>
    <v-col class="d-flex justify-end" cols="4">
      <SecondaryButton
        label="Back"
        @click="handleBack"
        :icon="icons.ui.arrowLeft"
        color="error"
        size="small"
      />
    </v-col>
  </v-row>
</template>

<script setup>
// vue
import { useRoute } from "vue-router";
import { computed, inject } from "vue";
// composables
// Components
import MainHeader from "@/components/primitives/headers/MainHeader.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import { useRouter } from "vue-router";
const icons = inject("icons");
const router = useRouter();
const route = useRoute();

// eslint-disable-next-line no-undef
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const assetType = computed(() => route.query.asset.toLowerCase());

const assetEditComponents = {
  weekendresults: "Weekend Results",
  ladder: "Ladder",
  top5bowlinglist: "Top 5 Bowling",
  top5battinglist: "Top 5 Batting",
  upcomingfixtures: "Upcoming Fixtures",
  weekendsinglegameresult: "Single Game Result",
};
const handleBack = () => {
  router.back();
};
</script>
