<template>
  <template v-if="isSaving || isFetching">
    <LoadingSpinner type="card" />
  </template>

  <template v-else-if="!dataObj">
    No data available for the selected asset.
  </template>

  <template v-else>
    <!-- Video Meta Data Section -->
    <VideoMetaDataEdit v-if="dataObj && (dataObj.videoMeta || dataObj.VIDEOMETA)"
      :videoMeta="dataObj.videoMeta || dataObj.VIDEOMETA" @update="updateVideoMeta" />
    <div class="d-flex justify-end align-center items-center my-2 w-full">
      <PrimaryButton color="success" @click="saveAllChanges" label="Update Meta Data" />
    </div>

    <!-- Draggable Fixtures List -->
    <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md mt-4">
      <div class="card-title py-2 px-4">Fixtures</div>
      <v-card class="pa-2 elevation-0 bg-surface rounded-md">
        <Container @drop="onDrop">
          <Draggable v-for="(fixture, index) in fixtures" :key="fixture.gameID">
            <FixtureResultItem :fixture="fixture" :index="index" :lastIndex="fixtures.length - 1"
              @updateFixtureField="updateFixture" @saveFixture="saveFixture" />
          </Draggable>
        </Container>
      </v-card>
    </v-card>

    <div class="d-flex justify-end align-center items-center my-2 w-full">
      <PrimaryButton color="success" @click="saveAllChanges" label="Save All Changes" />
    </div>
  </template>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Container, Draggable } from "vue3-smooth-dnd";
import { useFetchFixturaAsset } from "../composables/useFixturaAsset.js";
import { useSaveFixturaAsset } from "../composables/useSaveFixturaAsset.js";
import VideoMetaDataEdit from "@/pages/edit/AssetEditPortals/Sections/VideoMetaDataEdit.vue";
import LoadingSpinner from "@/components/UI/LoadingSpinner.vue";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import FixtureResultItem from "@/pages/edit/AssetEditPortals/Sections/fixtureResultItem.vue";

const { fetchAssetData, dataObj, isFetching } = useFetchFixturaAsset();
const { updateDataObj, saveToCMS, isSaving } = useSaveFixturaAsset();

const fixtures = ref([]);

// Load fixtures on component mount
onMounted(async () => {
  await fetchAssetData();
  console.log("[WeekendResultsEdit] dataObj loaded:", dataObj.value);
  // Handle both uppercase (DATA) and lowercase (data) field names
  const fixturesData = dataObj.value?.data || dataObj.value?.DATA;
  if (fixturesData && Array.isArray(fixturesData)) {
    fixtures.value = [...fixturesData];
  }
});

// Handle item reordering
function onDrop(dropResult) {
  const { removedIndex, addedIndex } = dropResult;
  if (removedIndex === null || addedIndex === null) return;

  const reorderedFixtures = [...fixtures.value];
  const [movedItem] = reorderedFixtures.splice(removedIndex, 1);
  reorderedFixtures.splice(addedIndex, 0, movedItem);

  fixtures.value = reorderedFixtures; // Update the fixture list
}

function updateFixture({ index, key, value }) {
  if (fixtures.value[index]) {
    // Handle nested keys like "homeTeam.battingPerformances"
    const keys = key.split(".");
    let obj = fixtures.value[index];

    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) {
        obj[keys[i]] = {};
      }
      obj = obj[keys[i]];
    }

    // Use Vue's reactivity to ensure the update is tracked
    obj[keys[keys.length - 1]] = value;

    // Force reactivity by reassigning the array (this ensures Vue tracks the change)
    fixtures.value = [...fixtures.value];

    console.log("[WeekendResultsEdit] Updated fixture:", { index, key, value, fixture: fixtures.value[index] });
  }
}

function saveFixture() {
  // Handle both uppercase (DATA) and lowercase (data) field names
  if (dataObj.value?.data !== undefined) {
    dataObj.value.data = [...fixtures.value];
  } else {
    dataObj.value.DATA = [...fixtures.value];
  }
  saveToCMS();
}

function saveAllChanges() {
  // Handle both uppercase (DATA) and lowercase (data) field names
  if (dataObj.value?.data !== undefined) {
    dataObj.value.data = [...fixtures.value];
  } else {
    dataObj.value.DATA = [...fixtures.value];
  }
  saveToCMS();
}

function updateVideoMeta(updatedMeta) {
  // Handle both uppercase (VIDEOMETA) and lowercase (videoMeta) field names
  const currentVideoMeta = dataObj.value?.videoMeta || dataObj.value?.VIDEOMETA || {};
  if (dataObj.value?.videoMeta !== undefined) {
    updateDataObj({ videoMeta: { ...currentVideoMeta, ...updatedMeta } });
  } else {
    updateDataObj({ VIDEOMETA: { ...currentVideoMeta, ...updatedMeta } });
  }
}
</script>
