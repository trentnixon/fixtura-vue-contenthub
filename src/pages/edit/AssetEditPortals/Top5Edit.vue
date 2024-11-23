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
    <div class="d-flex justify-end align-center items-center my-2 w-full">
      <PrimaryButton
        color="success"
        @click="saveAllChanges"
        label="Update Meta Data"
      />
    </div>

    <!-- Draggable Top Players List -->
    <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md mt-4">
      <div class="card-title py-2 px-4">Top 5 Players</div>
      <v-card class="pa-2 elevation-0 bg-surface rounded-md">
        <Container @drop="onDrop">
          <Draggable v-for="(player, index) in players" :key="index">
            <TopPlayerItem
              :player="player"
              :index="index"
              :lastIndex="players.length - 1"
              :assetType="assetType"
              @updatePlayerField="updatePlayer"
              @savePlayer="savePlayer"
            />
          </Draggable>
        </Container>
      </v-card>
    </v-card>

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
import { onMounted, ref, defineProps, computed } from "vue";
import { useAccountStore } from "@/store/account";
import { Container, Draggable } from "vue3-smooth-dnd";
import { useFetchFixturaAsset } from "../composables/useFixturaAsset.js";
import { useSaveFixturaAsset } from "../composables/useSaveFixturaAsset.js";
import VideoMetaDataEdit from "@/pages/edit/AssetEditPortals/Sections/VideoMetaDataEdit.vue";
import LoadingSpinner from "@/components/UI/LoadingSpinner.vue";
import TopPlayerItem from "./Sections/TopPlayerItem.vue";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";

const props = defineProps({
  assetType: String,
});

const { fetchAssetData, dataObj, isFetching } = useFetchFixturaAsset();
const { updateDataObj, saveToCMS, isSaving } = useSaveFixturaAsset();
const accountState = useAccountStore();

const players = ref([]);
const isAssociation = computed(() => accountState.getAccountType === 2);

// Load players on component mount
onMounted(async () => {
  await fetchAssetData();
  if (dataObj.value.DATA) {
    players.value = [...dataObj.value.DATA];
  }
  if (isAssociation.value) {
    await accountState.fetchRelatedClubsAction(
      accountState.getOrganizationDetails.id
    );
  }
});

// Handle item reordering
function onDrop(dropResult) {
  const { removedIndex, addedIndex } = dropResult;
  if (removedIndex === null || addedIndex === null) return;

  const reorderedPlayers = [...players.value];
  const [movedItem] = reorderedPlayers.splice(removedIndex, 1);
  reorderedPlayers.splice(addedIndex, 0, movedItem);

  players.value = reorderedPlayers; // Update the player list
}

function updatePlayer({ index, key, newValue }) {
  if (players.value[index]) {
    players.value[index][key] = newValue;
  }
}

function savePlayer(index) {
  dataObj.value.DATA = [...players.value];
  saveToCMS();
}

function saveAllChanges() {
  dataObj.value.DATA = [...players.value];
  saveToCMS();
}

function updateVideoMeta(updatedMeta) {
  updateDataObj({ VIDEOMETA: { ...dataObj.value.VIDEOMETA, ...updatedMeta } });
}
</script>
