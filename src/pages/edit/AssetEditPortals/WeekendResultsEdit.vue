<template>
  <template v-if="isSaving || isFetching">
    <LoadingSpinner type="card" />
  </template>

  <template v-else-if="!dataObj">
    No data available for the selected asset.
  </template>

  <template v-else>
    <!-- Video Meta Data Section -->
    <VideoMetaDataEdit v-if="dataObj && dataObj.VIDEOMETA" :videoMeta="dataObj.VIDEOMETA" @update="updateVideoMeta" />
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
  if (dataObj.value && dataObj.value.DATA) {
    fixtures.value = [...dataObj.value.DATA];
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

function updateFixture({ index, key, newValue }) {
  if (fixtures.value[index]) {
    fixtures.value[index][key] = newValue;
  }
}

function saveFixture() {
  dataObj.value.DATA = [...fixtures.value];
  saveToCMS();
}

function saveAllChanges() {
  dataObj.value.DATA = [...fixtures.value];
  saveToCMS();
}

function updateVideoMeta(updatedMeta) {
  updateDataObj({ VIDEOMETA: { ...dataObj.value.VIDEOMETA, ...updatedMeta } });
}
</script>
