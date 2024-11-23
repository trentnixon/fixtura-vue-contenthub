<template>
  <template v-if="isSaving || isFetching">
    <LoadingSpinner type="card" />
  </template>

  <template v-else-if="!dataObj">
    No data available for the selected asset.
  </template>

  <template v-else>
    <!-- Video Meta Data Section -->
    <VideoMetaDataEdit
      :videoMeta="dataObj.VIDEOMETA"
      @update="updateVideoMeta"
    />

    <v-container>
      <div
        class="d-flex justify-center align-center items-center my-2 w-full bg-surface-lighten1 pa-4 rounded-md"
      >
        <div class="text-subtitle">Ladder Assets can not be altered</div>
      </div>
    </v-container>

    <div class="d-flex justify-end align-center items-center my-2 w-full">
      <PrimaryButton
        color="success"
        @click="saveAllChanges"
        label="Save All Changes"
      />
    </div>
  </template>
</template>

<script setup>
import { onMounted } from "vue";
import { useFetchFixturaAsset } from "../composables/useFixturaAsset.js";
import { useSaveFixturaAsset } from "../composables/useSaveFixturaAsset.js";
import VideoMetaDataEdit from "@/pages/edit/AssetEditPortals/Sections/VideoMetaDataEdit.vue";
import LoadingSpinner from "@/components/UI/LoadingSpinner.vue";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";

const { fetchAssetData, dataObj, isFetching } = useFetchFixturaAsset();
const { updateDataObj, saveToCMS, isSaving } = useSaveFixturaAsset();

onMounted(() => {
  fetchAssetData(); // Fetch asset data on component mount
});

// Update VideoMeta data within dataObj
function updateVideoMeta(updatedMeta) {
  updateDataObj({ VIDEOMETA: { ...dataObj.value.VIDEOMETA, ...updatedMeta } });
}

// Save changes to CMS

function saveAllChanges() {
  saveToCMS();
}
</script>
