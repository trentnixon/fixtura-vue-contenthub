<template>
  <v-col cols="12" lg="4" sm="6" class="px-1">
    <MediaLayout>
      <!-- Header Slot -->
      <template v-slot:header>
        <div class="text-leading">
          <template v-if="fixture.isUserHomeTeam">
            {{ fixture.teamHome }}
          </template>
          <template v-else-if="fixture.isUserAwayTeam">
            {{ fixture.teamAway }}
          </template>
        </div>
      </template>

      <!-- Video Body -->
      <template v-slot:body>
        <template v-if="!teamRoster">
          <div class="d-flex justify-start align-center pa-4">
            <v-icon color="error" class="mr-4" :icon="icons.media.videoOff" />
            <div class="text-body">No roster available</div>
          </div>
        </template>
        <template v-else-if="isRosterSaving">
          <v-skeleton-loader color="surface" type="card" />
        </template>
        <template v-else>
          <v-container class="pa-0">
            <v-row>
              <v-col cols="12">
                <ul>
                  <li v-for="(player, index) in userTeam?.players" :key="'player-' + index"
                    :class="['d-flex', 'align-center', 'justify-space-between', 'py-1', 'px-2', 'border-b-thin']">
                    <v-icon :icon="icons.ui.player" />
                    <div class="text-body">
                      {{ player }}
                    </div>
                    <v-btn-toggle class="ml-2 mb-1" rounded="md" color="primary" variant="outlined" :mandatory="false"
                      :group="false">
                      <IconButton :icon="icons.ui.edit" color="primary" @click="editPlayer(index)" variant="outlined"
                        size="small" tooltip="Edit Player" />
                      <IconButton :icon="icons.ui.delete" color="error" @click="confirmDeletePlayer(index)"
                        variant="outlined" size="small" tooltip="Delete Player" />
                    </v-btn-toggle>
                  </li>

                </ul>
                <div class="d-flex justify-space-between pa-2 w-100 ">
                  <v-btn-toggle class="ml-2 mb-1" rounded="md" color="primary" variant="outlined" :mandatory="false"
                    :group="false">
                    <IconButton :icon="icons.ui.extLink" color="primary" size="small" @click="viewFixture"
                      tooltip="View Fixture" variant="outlined" />
                  </v-btn-toggle>

                  <v-btn-toggle class="ml-2 mb-1" rounded="md" color="primary" variant="outlined" :mandatory="false"
                    :group="false">
                    <IconButton :icon="icons.ui.add" size="small" color="primary" @click="addPlayer"
                      tooltip="Add Player" variant="outlined" />
                    <IconButton :icon="icons.ui.save" size="small" color="success" @click="saveRoster"
                      tooltip="Save Changes to Roster" variant="outlined">
                      <!-- Badge to indicate unsaved changes -->
                      <v-badge v-if="hasUnsavedChanges" content="!" color="error"></v-badge>
                    </IconButton>
                  </v-btn-toggle>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </template>
    </MediaLayout>

    <!-- Edit Player Modal -->
    <v-dialog v-model="isModalOpen" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Player</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="editedPlayerName" label="Player Name"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <SecondaryButton color="error" label="Cancel" @click="closeModal" />
          <PrimaryButton color="success" label="Save" @click="savePlayer" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Player Confirmation Modal -->
    <v-dialog v-model="isDeleteModalOpen" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Delete Player</span>
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete {{ userTeam?.players[currentDeleteIndex] }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <SecondaryButton color="error" label="Cancel" @click="closeDeleteModal" />
          <PrimaryButton color="success" label="Delete" @click="deletePlayerConfirmed" variant="outlined" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for Notifications -->
    <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </v-col>
</template>

<script setup>
import MediaLayout from "@/components/containers/media/mediaLayout.vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import { defineProps, ref, computed, inject } from "vue";
import { useRosterFixtures } from "../../composables/useRenderFixturesForRosters";

const icons = inject("icons");

// Define the props the component will receive
const props = defineProps({
  fixture: {
    type: Object,
    required: true,
  },
});

const teamRoster = computed(() => props.fixture.TeamRoster);
const userTeam = computed(() =>
  props.fixture.isUserHomeTeam ? teamRoster.value?.homeTeam : teamRoster.value?.awayTeam
);

const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const editedPlayerName = ref("");
const currentEditIndex = ref(null);
const currentDeleteIndex = ref(null);
const hasUnsavedChanges = ref(false);

const snackbar = ref({
  visible: false,
  message: "",
  color: "success",
  timeout: 3000,
});

const openModal = (index) => {
  currentEditIndex.value = index;
  editedPlayerName.value = userTeam.value?.players[index];
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editedPlayerName.value = "";
};

const savePlayer = () => {
  if (userTeam.value?.players) {
    userTeam.value.players[currentEditIndex.value] = editedPlayerName.value;
    hasUnsavedChanges.value = true;
    showSnackbar("Player saved successfully", "success");
  }
  closeModal();
};

const editPlayer = (index) => {
  openModal(index);
};

const confirmDeletePlayer = (index) => {
  currentDeleteIndex.value = index;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  currentDeleteIndex.value = null;
};

const deletePlayerConfirmed = () => {
  if (userTeam.value?.players) {
    userTeam.value.players.splice(currentDeleteIndex.value, 1);
    hasUnsavedChanges.value = true;
    showSnackbar("Player deleted successfully", "success");
  }
  closeDeleteModal();
};

const addPlayer = () => {
  if (userTeam.value?.players) {
    userTeam.value.players.push("New Player");
    hasUnsavedChanges.value = true;
    showSnackbar("Player added successfully", "success");
  }
};

// Function to open the external link for scorecard
const openScoreCard = () => {
  const url = `https://www.playhq.com${props.fixture.urlToScoreCard}`;
  window.open(url, "_blank");
};
// Composable to handle roster fixtures
const { saveRosterChanges, isRosterSaving } = useRosterFixtures();

// Save Roster
const saveRoster = () => {
  saveRosterChanges(props.fixture.id, teamRoster.value);
  hasUnsavedChanges.value = false;
  showSnackbar("Roster saved successfully", "success");
};

// Show Snackbar
const showSnackbar = (message, color = "success") => {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.visible = true;
};

// Watch for changes to userTeam to track unsaved changes
/* watch(userTeam, () => {
  hasUnsavedChanges.value = true;
}, { deep: true }); */
</script>
