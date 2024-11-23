<template>
  <!-- View Toggle Button Group -->
  <template v-if="rosterFixtures">
    <v-divider class="my-2"></v-divider>
    <div class="d-flex justify-space-between pa-0 w-100">
      <div class="d-flex justify-end">
        <v-btn-toggle v-model="currentView" class="my-4" mandatory>
          <PrimaryButton
            value="imageAsset"
            color="primary"
            label="View Downloads"
            :disabled="!rosterFixtures.length"
          />
          <PrimaryButton
            value="rosterPoster"
            color="primary"
            label="Edit Rosters"
            :disabled="!rosterFixtures.length"
          />
        </v-btn-toggle>
      </div>
      <v-btn-toggle class="my-4 d-flex justify-end">
        <IconButton
          :icon="icons.ui.sync"
          color="primary"
          @click="openConfirmModal"
          variant="outlined"
          size="small"
          tooltip="Sync with PlayHQ"
          :loading="loading || isPolling || isCreatingRoster"
          :disabled="loading || isPolling"
        />
        <IconButton
          :icon="icons.media.createImage"
          color="primary"
          @click="openCreateRosterModal"
          variant="outlined"
          size="small"
          tooltip="Create Rosters"
          :loading="loading || isPolling || isCreatingRoster"
          :disabled="isCreatingRoster"
        />
        <IconButton
          :icon="
            showInstructions ? icons.ui.instructionsOff : icons.ui.instructions
          "
          color="primary"
          @click="toggleInstructions"
          variant="outlined"
          size="small"
          tooltip="Toggle Instructions"
          :loading="loading || isPolling || isCreatingRoster"
        />
      </v-btn-toggle>
    </div>
    <v-divider class="my-2"></v-divider>
  </template>

  <!-- Conditional Rendering Based on Selected View -->
  <template v-if="currentView === 'rosterPoster'">
    <template v-if="loading || !rosterFixtures">
      <MediaLayout>
        <template v-slot:header>
          <CategoryHeader
            :title="'Searching for Fixtures'"
            :icon="icons.ui.fetching"
            fetching
          />
        </template>
        <template v-slot:body>
          <v-skeleton-loader type="card" class="my-2" />
        </template>
      </MediaLayout>
    </template>
    <template v-else-if="isPolling || isPollingCreation">
      <MediaLayout>
        <template v-slot:header>
          <CategoryHeader
            :title="`Scouting team line-up${
              rosterFixtures.length > 1 ? 's' : ''
            } for ${rosterFixtures.length} upcoming match${
              rosterFixtures.length > 1 ? 'es' : ''
            }... `"
            :icon="icons.ui.fetching"
          />
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
      <div class="text-body my-4">No fixtures available.</div>
    </template>
    <template v-else>
      <div class="d-flex justify-space-between pa-0 mt-4 w-100">
        <span class="card-title">Team Rosters</span>
        <span class="card-title"
          >Fixtures Found: {{ rosterFixtures.length }}</span
        >
      </div>
      <HowToGuide
        :showInstructions="showInstructions"
        :loading="loading"
        :isPolling="isPolling"
      />
      <v-container>
        <v-row>
          <RosterFixtureItem
            v-for="fixture in rosterFixtures"
            :key="fixture.id"
            :fixture="fixture"
          />
        </v-row>
      </v-container>
    </template>
  </template>

  <template v-else>
    <template v-if="isPollingCreation">
      <MediaLayout>
        <template v-slot:header>
          <CategoryHeader
            title="Creating Assets... Please Wait"
            :icon="icons.ui.fetching"
          />
        </template>
        <template v-slot:body>
          <v-skeleton-loader type="card" class="my-2" />
        </template>
      </MediaLayout>
    </template>
    <template v-else-if="galleryState === 'unknown'">
      <div>Team Rosters yet to be Created</div>
    </template>
    <template v-else>
      <template v-if="versionOptions.length > 1">
        <div class="d-flex justify-space-between align-center pa-0 w-100">
          <v-spacer></v-spacer>
          <v-select
            v-model="rosterVersion"
            :items="versionOptions"
            item-title="name"
            item-value="value"
            label="Select Roster Version"
            variant="outlined"
          />
        </div>
      </template>
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
        Syncing with PlayHQ will update Fixtura with the latest player rosters,
        which may overwrite any recent changes you have made. Are you sure you
        want to continue?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <SecondaryButton
          color="error"
          label="Cancel"
          @click="closeConfirmModal"
        />
        <PrimaryButton color="success" label="Confirm" @click="confirmSync" />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Confirmation Modal for Create Team Rosters -->
  <v-dialog v-model="isCreateRosterModalOpen" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Create Team Rosters</span>
      </v-card-title>
      <v-card-text>
        Click to create the team rosters for this week. Please ensure any
        changes are saved before proceeding.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <SecondaryButton
          color="error"
          label="Cancel"
          @click="closeCreateRosterModal"
        />
        <PrimaryButton
          color="success"
          label="Create"
          @click="confirmCreateRoster"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {
  defineProps,
  computed,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  inject,
} from "vue";
import { useRoute } from "vue-router";
import { useStorage } from "@vueuse/core";
import { useCreateRoster } from "../composables/useCreateRoster";
import { useAssetState } from "@/pages/asset/composables/useAssetState";
import AssetStateRenderer from "@/pages/asset/assets/AssetState/AssetStateRenderer.vue";
import { useRosterFixtures } from "../composables/useRenderFixturesForRosters";
import RosterFixtureItem from "../assets/media/RosterFixtureItem.vue";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import MediaLayout from "@/components/containers/media/mediaLayout.vue";
import CategoryHeader from "@/components/primitives/headers/CategoryHeader.vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import HowToGuide from "@/pages/asset/assets/components/HowToGuide.vue";

const props = defineProps({
  formattedAssets: {
    type: Array,
    required: true,
  },
});

const icons = inject("icons");
const route = useRoute();
const renderId = ref(Number(route.params.renderid));
const groupingCategory = ref(route.params.groupingcategory);

// Determine initial version of the roster based on props
const rosterVersion = ref(
  props.formattedAssets.length > 0 ? props.formattedAssets.length - 1 : 0
);

// Initialize state and composable usage
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

const {
  createRoster,
  loading: isCreatingRoster,
  isPolling: isPollingCreation,
  resumeCreationPollingIfNeeded,
} = useCreateRoster();

// Computed value for current image asset
const imageAsset = computed(
  () => props.formattedAssets[rosterVersion.value] || null
);

// State management for UI views
const currentView = ref(
  props.formattedAssets.length > 0 ? "imageAsset" : "rosterPoster"
);
const isConfirmModalOpen = ref(false);
const isCreateRosterModalOpen = ref(false);
const galleryState = ref("unknown");
const showInstructions = useStorage("showInstructions", true);

// Computed options for selecting roster versions
const versionOptions = computed(() => {
  return props.formattedAssets
    .map((_, index) => ({
      value: index, // Aligns with the index of `formattedAssets` array
      name: `Version ${index + 1}`,
    }))
    .reverse(); // Reverse to make the latest version appear first
});

// Fetch fixtures when the component is mounted
onMounted(() => {
  if (currentView.value === "rosterPoster") {
    fetchFixtures();
    resumePollingIfNeeded();
    resumeCreationPollingIfNeeded();
  }
});

// Stop polling when the component is unmounted
onBeforeUnmount(() => {
  stopPolling();
});

// Watch for changes in `imageAsset` and update `galleryState`
watch(
  imageAsset,
  (newAsset) => {
    if (newAsset) {
      //console.log("[watch: imageAsset] Updated imageAsset:", newAsset);
      const { assetState } = useAssetState(newAsset);
      galleryState.value = assetState;
    } else {
      console.warn("[watch: imageAsset] Image asset is undefined.");
      galleryState.value = "unknown"; // Set galleryState to unknown if no asset is found
    }
  },
  { immediate: true }
);

// Watch for changes in `renderId` and `groupingCategory`, and refetch fixtures if they change
watch(
  [renderId, groupingCategory],
  async (
    [newRenderId, newGroupingCategory],
    [oldRenderId, oldGroupingCategory]
  ) => {
    if (
      newRenderId !== oldRenderId ||
      newGroupingCategory !== oldGroupingCategory
    ) {
      await fetchFixtures(); // Explicitly await the fetch to ensure it's complete
    }
  },
  { immediate: true }
);

// Watch for changes in `formattedAssets` and update relevant state
watch(
  () => props.formattedAssets,
  (newAssets) => {
    if (newAssets.length > 0 && rosterVersion.value !== newAssets.length - 1) {
      rosterVersion.value = newAssets.length - 1; // Set to the latest version if it hasn't been set already
      //console.log("[watch: formattedAssets] Updated rosterVersion to:", rosterVersion.value);
    }

    currentView.value = newAssets.length > 0 ? "imageAsset" : "rosterPoster";
  },
  { immediate: true }
);

// Watch for changes in `rosterVersion` and update `imageAsset` and `galleryState`
watch(
  rosterVersion,
  (newVersion) => {
    //console.log("Roster version changed:", newVersion);
    if (props.formattedAssets.length > 0) {
      const newAsset = props.formattedAssets[newVersion];
      if (newAsset && typeof newAsset === "object" && "id" in newAsset) {
        //console.log("[watch: rosterVersion] Updated imageAsset:", newAsset);
        const { assetState } = useAssetState(newAsset);
        galleryState.value = assetState.value;
      }
    }
  },
  { immediate: true }
);

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

// Open create roster modal
const openCreateRosterModal = () => {
  isCreateRosterModalOpen.value = true;
};

// Close create roster modal
const closeCreateRosterModal = () => {
  isCreateRosterModalOpen.value = false;
};

// Confirm create roster action
const confirmCreateRoster = () => {
  closeCreateRosterModal();
  createRoster();
};

// Toggle instructions panel
const toggleInstructions = () => {
  showInstructions.value = !showInstructions.value;
};
</script>
