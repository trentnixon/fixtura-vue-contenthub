<template>
  <!-- View Toggle Button Group -->
  <template v-if="rosterFixtures">
    <v-divider class="my-2"></v-divider>
    <div class="d-flex justify-space-between pa-0 w-100">
      <div class="d-flex justify-end">
        <v-btn-toggle v-model="currentView" class="my-4" mandatory>
          <PrimaryButton value="rosterPoster" color="primary" label="Edit Rosters">Roster Poster</PrimaryButton>
          <PrimaryButton value="imageAsset" color="primary" label="View Downloads" />
        </v-btn-toggle>
      </div>

      <v-btn-toggle class="my-4 d-flex justify-end">
        <IconButton :icon="icons.ui.sync" color="primary" @click="openConfirmModal" variant="outlined" size="small"
          tooltip="Sync with PlayHQ" :loading="loading || isPolling" :disabled="loading || isPolling" />
        <IconButton :icon="icons.media.createImage" color="primary" @click="openConfirmModal" variant="outlined"
          size="small" tooltip="Create Rosters" :loading="loading || isPolling" :disabled="loading || isPolling" />
      </v-btn-toggle>
    </div>
    <v-divider class="my-2"></v-divider>

    <div>
      How to Create your Rosters
      <div class="body-text">
        <!-- Instructions for Syncing Team Rosters -->
        To sync your team rosters with the latest data from PlayHQ, click the <v-icon>{{ icons.ui.sync }}</v-icon> icon.
        This will ensure your rosters are up to date. Please note that syncing may overwrite any manual changes made.
      </div>
      <div class="body-text">
        <!-- Instructions for Creating Images -->
        To create images for your team roster, click the <v-icon>{{ icons.media.createImage }}</v-icon> icon. This will
        generate visual assets for your team.
      </div>
      <div class="body-text">
        <!-- Instructions for Editing Features -->
        Use the edit buttons next to each player to modify their details.
        - Click the <v-icon>{{ icons.ui.edit }}</v-icon> icon to edit a player's name.
        - Click the <v-icon>{{ icons.ui.delete }}</v-icon> icon to remove a player from the roster.
      </div>
      <div class="body-text">
        <!-- Instructions for Adding, Saving, and Viewing -->
        To manage your roster effectively:
        - Click the <v-icon>{{ icons.ui.extLink }}</v-icon> icon to view the fixture details on PlayHQ.
        - To add a new player to the roster, click the <v-icon>{{ icons.ui.add }}</v-icon> icon.
        - After making any changes, click the <v-icon>{{ icons.ui.save }}</v-icon> icon to save your roster updates. If
        there are unsaved changes, a red badge will appear on the save button to remind you.
      </div>
    </div>

  </template>

  <!-- Conditional Rendering Based on Selected View -->
  <template v-if="currentView === 'rosterPoster'">
    <template v-if="loading || !rosterFixtures">
      <MediaLayout>
        <template v-slot:header>
          <CategoryHeader :title="'Searching for Fixtures'" icon="mdi-text-search" />
        </template>
        <template v-slot:body>
          <v-skeleton-loader type="card" class="my-2" />
        </template>
      </MediaLayout>
    </template>
    <template v-else-if="isPolling">
      <MediaLayout>
        <template v-slot:header>
          <CategoryHeader
            :title="`Scouting team line-up${rosterFixtures.length > 1 ? 's' : ''} for ${rosterFixtures.length} upcoming match${rosterFixtures.length > 1 ? 'es' : ''}... `"
            icon="mdi-text-search" />
        </template>
        <template v-slot:body>
          <v-skeleton-loader type="card" class="my-2" />
        </template>
      </MediaLayout>
    </template>
    <template v-else-if="error">
      {{ error }}
    </template>
    <template v-else-if="!rosterFixtures.length">
      No fixtures available.
    </template>
    <template v-else>
      <v-container>
        <v-row>
          <RosterFixtureItem v-for="fixture in rosterFixtures" :key="fixture.id" :fixture="fixture" />
        </v-row>
      </v-container>
    </template>
  </template>

  <template v-else>

    <template v-if="galleryState === 'unknown'">
      {{ galleryState }}
    </template>
    <template v-else>
      <AssetStateRenderer :asset="imageAsset" :state="galleryState" />
    </template>

  </template>

  <!-- Confirmation Modal for Sync with PlayHQ -->
  <v-dialog v-model="isConfirmModalOpen" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Fetching Team Rosters</span>
      </v-card-title>
      <v-card-text>
        Syncing with PlayHQ will update Fixtura with the latest player rosters, which may overwrite any recent changes
        you
        have made. Are you sure you want to continue?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <SecondaryButton color="error" label="Cancel" @click="closeConfirmModal" />
        <PrimaryButton color="success" label="Confirm" @click="confirmSync" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, computed, ref, watch, onMounted, onBeforeUnmount, inject } from "vue";
import { useRoute } from "vue-router";
const icons = inject("icons");
import { useAssetState } from "@/pages/asset/composables/useAssetState";
import AssetStateRenderer from "@/pages/asset/assets/AssetState/AssetStateRenderer.vue";
import { useRosterFixtures } from "../composables/useRenderFixturesForRosters";
import RosterFixtureItem from "../assets/media/RosterFixtureItem.vue";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import MediaLayout from "@/components/containers/media/mediaLayout.vue";
import CategoryHeader from "@/components/primitives/headers/CategoryHeader.vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";

const props = defineProps({
  formattedAssets: {
    type: Array,
    required: true,
  },
});

const route = useRoute();
const renderId = ref(Number(route.params.renderid));
const groupingCategory = ref(route.params.groupingcategory);

const {
  resumePollingIfNeeded,
  rosterFixtures,
  loading,
  isPolling,
  stopPolling,
  error,
  fetchFixtures,
  requestTeamRoster,
} = useRosterFixtures();

const imageAsset = computed(() =>
  props.formattedAssets.find((asset) => asset.category === "IMAGE")
);

const { assetState: galleryState } = useAssetState(imageAsset.value);
const currentView = ref("rosterPoster");
const isConfirmModalOpen = ref(false);

// Fetch fixtures when the component is mounted
onMounted(() => {
  if (currentView.value === "rosterPoster") {
    fetchFixtures();
    resumePollingIfNeeded();
  }
});

// Stop polling when the component is unmounted
onBeforeUnmount(() => {
  stopPolling();
});

// Watch for changes in renderId and groupingCategory, and refetch fixtures if they change
watch([renderId, groupingCategory], () => {
  fetchFixtures();
});

// Open confirmation modal
const openConfirmModal = () => {
  isConfirmModalOpen.value = true;
};

// Close confirmation modal
const closeConfirmModal = () => {
  isConfirmModalOpen.value = false;
};

// Confirm sync action
const confirmSync = () => {
  closeConfirmModal();
  requestTeamRoster();
};
</script>
