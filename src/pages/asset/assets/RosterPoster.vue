<template>
  <!-- View Toggle Button Group -->
  <v-btn-toggle v-model="currentView" class="my-4" mandatory>
    <v-btn value="rosterPoster" color="primary">Roster Poster</v-btn>
    <v-btn value="imageAsset" color="primary">Image Asset</v-btn>
  </v-btn-toggle>

  <v-row>
    <!-- Conditional Rendering Based on Selected View -->
    <template v-if="currentView === 'rosterPoster'">
      <template v-if="!rosterFixtures">
        <v-btn @click="fetchFixtures" color="primary" class="my-4">
          Load Roster Fixtures
        </v-btn>
      </template>
      <template v-else-if="loading">Loading Roster Fixtures...</template>
      <template v-else-if="error">{{ error }}</template>
      <template v-else-if="!rosterFixtures.length"
        >No roster fixtures available.</template
      >
      <template v-else>
        <div
          v-for="fixture in rosterFixtures"
          :key="fixture.id"
          class="fixture-item"
        >
          <div>
            <strong>{{ fixture.teamHome }}</strong> vs
            <strong>{{ fixture.teamAway }}</strong> - {{ fixture.ageGroup }}
          </div>
          <a :href="fixture.urlToScoreCard" target="_blank">View Scorecard</a>
        </div>
      </template>
    </template>

    <template v-else>
      <AssetStateRenderer :asset="imageAsset" :state="galleryState" />
    </template>

    <v-col cols="12"> </v-col>
  </v-row>
</template>

<script setup>
import { useAssetState } from "@/pages/asset/composables/useAssetState";
import { defineProps, computed, ref } from "vue";
import AssetStateRenderer from "@/pages/asset/assets/AssetState/AssetStateRenderer.vue";
import { useRosterFixtures } from "../composables/useRenderFixturesForRosters";

const props = defineProps({
  formattedAssets: {
    type: Array,
    required: true,
  },
});

// Extract image assets from formatted assets
const imageAsset = computed(() =>
  props.formattedAssets.find((asset) => asset.category === "IMAGE")
);

const { assetState: galleryState } = useAssetState(imageAsset.value);

// Manage current view state
const currentView = ref("rosterPoster");

// Use the roster fixtures composable
const { rosterFixtures, loading, error, fetchFixtures } = useRosterFixtures();
</script>
