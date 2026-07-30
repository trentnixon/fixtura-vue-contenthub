<template>
  <template v-if="isFetching">
    <LoadingSpinner type="card" />
  </template>

  <template v-else-if="!dataObj">
    No data available for the selected asset.
  </template>

  <template v-else>
    <VideoMetaDataEdit
      v-if="dataObj && (dataObj.videoMeta || dataObj.VIDEOMETA)"
      :videoMeta="dataObj.videoMeta || dataObj.VIDEOMETA"
      @update="updateVideoMeta"
    />
    <div class="d-flex justify-end align-center items-center my-2 w-full">
      <PrimaryButton
        color="success"
        @click="saveVideoMeta"
        label="Update Meta Data"
      />
    </div>

    <v-alert
      v-if="squadStatusMessage"
      :type="players.length < TOTW_MIN_SQUAD_SIZE ? 'warning' : 'info'"
      variant="tonal"
      class="mb-4"
    >
      {{ squadStatusMessage }}
    </v-alert>

    <v-row class="mt-4 align-start totw-edit-layout">
      <v-col cols="12" class="totw-edit-layout__list">
        <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md h-100">
          <div class="card-title py-2 px-4 d-flex align-center justify-space-between">
            <span>Team Selection ({{ players.length }}/{{ TOTW_MAX_SQUAD_SIZE }})</span>
          </div>
          <v-card class="pa-2 elevation-0 bg-surface rounded-md">
            <p class="text-body-2 px-2 mb-2 text-medium-emphasis">
              Select one player to edit. Drag the handle to reorder — order saves
              automatically.
            </p>
            <div class="totw-player-list">
              <Container
                drag-handle-selector=".totw-drag-handle"
                lock-axis="y"
                @drop="onDrop"
              >
                <Draggable
                  v-for="(player, index) in players"
                  :key="index"
                >
                  <TeamOfTheWeekPlayerRow
                    :player="player"
                    :index="index"
                    :selected="selectedPlayerIndex === index"
                    :can-remove="canRemovePlayer"
                    @select="selectPlayer"
                    @remove="requestRemovePlayer"
                  />
                </Draggable>
              </Container>
            </div>
            <div v-if="canAddPlayer" class="d-flex justify-center pa-3">
              <SecondaryButton
                color="primary"
                label="Add Player"
                icon="mdi-account-plus"
                @click="addPlayer"
              />
            </div>
          </v-card>
        </v-card>
      </v-col>

      <v-col cols="12" class="totw-edit-layout__form">
        <TeamOfTheWeekPlayerForm
          v-if="selectedPlayerIndex !== null && selectedPlayer"
          :player="selectedPlayer"
          :index="selectedPlayerIndex"
          @update-field="updatePlayerField"
        />

        <v-card
          v-else
          class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md h-100 totw-edit-placeholder"
        >
          <div class="card-title py-2 px-4">Player Details</div>
          <v-card
            class="pa-4 elevation-0 bg-surface rounded-md totw-edit-placeholder__body"
          >
            <p class="text-body-1 mb-0">
              Select a player from the squad list to edit their details.
            </p>
          </v-card>
        </v-card>
      </v-col>
    </v-row>

    <div class="d-flex justify-end align-center items-center my-4 w-full">
      <PrimaryButton
        color="success"
        @click="saveChanges"
        label="Save Changes"
        :disabled="selectedPlayerIndex === null || isSaving"
        :loading="isSaving"
      />
    </div>

    <ConfirmationModal
      v-model="showRemoveConfirmDialog"
      title="Remove player"
      @confirm="confirmRemovePlayer"
    >
      <p class="mb-2">
        Are you sure you want to remove
        <strong>{{ pendingRemovePlayerLabel }}</strong>
        from the squad?
      </p>
      <p class="text-body-2 text-medium-emphasis mb-0">
        This change won't be saved until you click Save Changes.
      </p>
    </ConfirmationModal>
  </template>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Container, Draggable } from "vue3-smooth-dnd";
import { useAccountStore } from "@/store/account";
import { useFetchFixturaAsset } from "../composables/useFixturaAsset.js";
import { useSaveFixturaAsset } from "../composables/useSaveFixturaAsset.js";
import {
  normalizeTotwPlayerForEdit,
  canAddTotwPlayer,
  canRemoveTotwPlayer,
  createDefaultTotwPlayer,
  getPlayerDisplayName,
  getSquadStatusMessage,
  applyTotwCategoryToPlayer,
  normalizeTotwCategory,
  serializeTotwPlayerForCms,
} from "../composables/useTotwPlayerStats";
import VideoMetaDataEdit from "@/pages/edit/AssetEditPortals/Sections/VideoMetaDataEdit.vue";
import LoadingSpinner from "@/components/UI/LoadingSpinner.vue";
import TeamOfTheWeekPlayerRow from "./Sections/TeamOfTheWeekPlayerRow.vue";
import TeamOfTheWeekPlayerForm from "./Sections/TeamOfTheWeekPlayerForm.vue";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import ConfirmationModal from "@/components/primitives/modals/ConfirmationModal.vue";
import {
  TOTW_MAX_SQUAD_SIZE,
  TOTW_MIN_SQUAD_SIZE,
} from "@/types/TeamOfTheWeek";

const route = useRoute();
const router = useRouter();
const { fetchAssetData, dataObj, isFetching } = useFetchFixturaAsset();
const { updateDataObj, saveToCMS, isSaving } = useSaveFixturaAsset();
const accountState = useAccountStore();

const players = ref([]);
const selectedPlayerIndex = ref(null);
const showRemoveConfirmDialog = ref(false);
const pendingRemoveIndex = ref(null);

const selectedPlayer = computed(() => {
  if (selectedPlayerIndex.value === null) return null;
  return players.value[selectedPlayerIndex.value] ?? null;
});

const canAddPlayer = computed(() => canAddTotwPlayer(players.value));
const canRemovePlayer = computed(() => canRemoveTotwPlayer(players.value));
const squadStatusMessage = computed(() =>
  getSquadStatusMessage(players.value.length)
);

const pendingRemovePlayer = computed(() => {
  if (pendingRemoveIndex.value === null) return null;
  return players.value[pendingRemoveIndex.value] ?? null;
});

const pendingRemovePlayerLabel = computed(() => {
  if (!pendingRemovePlayer.value) return "this player";
  return getPlayerDisplayName(pendingRemovePlayer.value);
});

onMounted(async () => {
  await fetchAssetData();

  const accountId = Number(route.query.accountid);
  if (accountId && !accountState.getOrganizationDetails) {
    await accountState.fetchFilteredAccountDetails(accountId);
  }

  const playersData = dataObj.value?.data || dataObj.value?.DATA;
  if (playersData && Array.isArray(playersData)) {
    players.value = playersData.map((player) => normalizeTotwPlayerForEdit(player));
  }

  const orgId =
    dataObj.value?.organisation?.id ?? accountState.getOrganizationDetails?.id;
  const isAssociationContext =
    accountState.getAccountType === 2 ||
    dataObj.value?.organisation?.type === "association";

  if (isAssociationContext && orgId) {
    await accountState.fetchRelatedClubsAction(Number(orgId));
  }
});

function selectPlayer(index) {
  selectedPlayerIndex.value = index;
}

function addPlayer() {
  if (!canAddPlayer.value) return;

  const newPlayer = createDefaultTotwPlayer(players.value);
  players.value = [...players.value, newPlayer];
  selectedPlayerIndex.value = players.value.length - 1;
}

async function onDrop(dropResult) {
  const { removedIndex, addedIndex } = dropResult;
  if (removedIndex === null || addedIndex === null) return;
  if (removedIndex === addedIndex) return;

  const reorderedPlayers = [...players.value];
  const [movedItem] = reorderedPlayers.splice(removedIndex, 1);
  reorderedPlayers.splice(addedIndex, 0, movedItem);
  players.value = reorderedPlayers;

  if (selectedPlayerIndex.value !== null) {
    const selectedIndex = selectedPlayerIndex.value;
    if (selectedIndex === removedIndex) {
      selectedPlayerIndex.value = addedIndex;
    } else if (removedIndex < selectedIndex && addedIndex >= selectedIndex) {
      selectedPlayerIndex.value = selectedIndex - 1;
    } else if (removedIndex > selectedIndex && addedIndex <= selectedIndex) {
      selectedPlayerIndex.value = selectedIndex + 1;
    }
  }

  syncPlayersToDataObj();
  await saveToCMS();
}

function requestRemovePlayer(index) {
  if (!canRemovePlayer.value || index < 0 || index >= players.value.length) {
    return;
  }

  pendingRemoveIndex.value = index;
  showRemoveConfirmDialog.value = true;
}

function confirmRemovePlayer() {
  if (pendingRemoveIndex.value === null) return;
  removePlayer(pendingRemoveIndex.value);
  pendingRemoveIndex.value = null;
}

function removePlayer(index) {
  if (!canRemovePlayer.value || index < 0 || index >= players.value.length) {
    return;
  }

  players.value = players.value.filter((_, playerIndex) => playerIndex !== index);

  if (selectedPlayerIndex.value === null) return;

  if (selectedPlayerIndex.value === index) {
    selectedPlayerIndex.value = null;
    return;
  }

  if (selectedPlayerIndex.value > index) {
    selectedPlayerIndex.value -= 1;
  }
}

function updatePlayerField({ key, value }) {
  if (selectedPlayerIndex.value === null) return;

  const index = selectedPlayerIndex.value;
  if (!players.value[index]) return;

  const keys = key.split(".");
  let obj = players.value[index];

  for (let i = 0; i < keys.length - 1; i++) {
    if (!obj[keys[i]] || typeof obj[keys[i]] !== "object") {
      obj[keys[i]] = {};
    }
    obj = obj[keys[i]];
  }

  obj[keys[keys.length - 1]] = value;

  if (key === "category") {
    const category = normalizeTotwCategory(value);
    if (category) {
      players.value[index] = applyTotwCategoryToPlayer(
        players.value[index],
        category
      );
    }
  }

  players.value = [...players.value];
}

function syncPlayersToDataObj() {
  const updatedPlayers = players.value.map((player) =>
    serializeTotwPlayerForCms(player)
  );
  if (dataObj.value?.data !== undefined) {
    dataObj.value.data = updatedPlayers;
    updateDataObj({ data: updatedPlayers });
  } else {
    dataObj.value.DATA = updatedPlayers;
    updateDataObj({ DATA: updatedPlayers });
  }
}

function saveVideoMeta() {
  saveToCMS();
}

async function saveChanges() {
  if (selectedPlayerIndex.value === null) return;

  syncPlayersToDataObj();
  await saveToCMS();

  const accountId = route.query.accountid;
  const sport = route.query.sport;
  const renderId = route.query.renderid;
  const groupingCategory = route.query.groupingcategory;
  const asset = route.query.asset;

  if (accountId && sport && renderId && groupingCategory && asset) {
    const encodedGrouping = encodeURIComponent(String(groupingCategory)).replace(
      /\//g,
      "%2F"
    );
    router.push(
      `/${accountId}/${sport}/${renderId}/${encodedGrouping}/${asset}`
    );
  }
}

function updateVideoMeta(updatedMeta) {
  const currentVideoMeta =
    dataObj.value?.videoMeta || dataObj.value?.VIDEOMETA || {};
  if (dataObj.value?.videoMeta !== undefined) {
    updateDataObj({ videoMeta: { ...currentVideoMeta, ...updatedMeta } });
  } else {
    updateDataObj({ VIDEOMETA: { ...currentVideoMeta, ...updatedMeta } });
  }
}
</script>

<style scoped>
@media (min-width: 960px) {
  .totw-edit-layout__list {
    flex: 0 0 40%;
    max-width: 40%;
  }

  .totw-edit-layout__form {
    flex: 0 0 60%;
    max-width: 60%;
  }
}

.totw-player-list {
  max-height: 70vh;
  overflow-y: auto;
}

.totw-edit-placeholder {
  min-height: 200px;
}

.totw-edit-placeholder__body {
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
