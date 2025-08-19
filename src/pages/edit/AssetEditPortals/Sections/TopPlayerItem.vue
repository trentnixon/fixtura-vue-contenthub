<template>
  <v-list-item class="my-2 border pa-2">
    <!-- Player Display -->
    <v-list-item-content>
      <v-list-item-title>
        {{ player.name }} ({{ primaryStat }})
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ player.playedFor }} - {{ player.assignSponsors.grade.name }}
      </v-list-item-subtitle>
    </v-list-item-content>

    <!-- Prepend: Player Logo -->
    <template v-slot:prepend>
      <v-avatar>
        <v-img :src="player.teamLogo.url" :alt="player.playedFor" />
      </v-avatar>
    </template>

    <!-- Append: Edit Button -->
    <template v-slot:append>
      <IconButton :icon="icons.ui.edit" color="success" @click="openEditModal" variant="tonal" size="small"
        tooltip="Edit Player" />
    </template>

    <!-- Modal -->
    <v-dialog v-model="isEditModalOpen" max-width="600">
      <v-card>
        <v-card-title>Edit Player</v-card-title>

        <v-card-text>
          <v-container class="pa-0">
            <!-- Logo Editing Option for Associations -->
            <FormRowTwoItems v-if="isAssociation">
              <template #description>
                <v-avatar>
                  <v-img :src="player.teamLogo.url || icons.default.logo" :alt="player.playedFor" />
                </v-avatar>
              </template>
              <template #form-element>
                <v-select label="" :items="getClubLogos" item-title="name" item-value="name"
                  :value="getSelectedClubName" @update:model-value="updateLogoByName" dense variant="outlined"
                  :loading="accountState.loading" />
              </template>
            </FormRowTwoItems>
            <!-- Common Fields -->
            <FormRowTwoItems>
              <template #description>
                <TextInput label="Player Name" :value="player.name" :validations="[isValidName, isRequired]"
                  @update="(val) => updatePlayerField('name', val)" />
              </template>
              <template #form-element>
                <TextInput label="Played For" :value="player.playedFor" :validations="[isValidName]"
                  @update="(val) => updatePlayerField('playedFor', val)" />
              </template>
            </FormRowTwoItems>

            <!-- Dynamic Fields for Batting or Bowling -->
            <FormRowTwoItems v-if="isBatting">
              <template #description>
                <TextInput label="Runs Scored" :value="player.runs"
                  :validations="[isValidNumber, (value) => maxLength(value, 3)]" type="number"
                  @update="(val) => updatePlayerField('runs', val)" />
              </template>
              <template #form-element>
                <TextInput label="Balls Faced" :value="player.balls"
                  :validations="[isValidNumber, (value) => maxLength(value, 3)]" type="number"
                  @update="(val) => updatePlayerField('balls', val)" />
              </template>
            </FormRowTwoItems>
            <FormRowTwoItems v-if="isBatting">
              <template #description>
                <TextInput label="Strike Rate" :value="player.SR"
                  :validations="[isValidNumber, (value) => maxLength(value, 6)]" type="number"
                  @update="(val) => updatePlayerField('SR', val)" />
              </template>
              <template #form-element>
                <v-select label="Not Out" :items="['Yes', 'No']" :value="player.notOut ? 'Yes' : 'No'"
                  @update:model-value="
                    (val) => updatePlayerField('notOut', val === 'Yes')
                  " variant="outlined" dense />
              </template>
            </FormRowTwoItems>

            <FormRowTwoItems v-if="isBowling">
              <template #description>
                <TextInput label="Wickets" :value="player.wickets"
                  :validations="[isValidNumber, (value) => maxLength(value, 2)]" type="number"
                  @update="(val) => updatePlayerField('wickets', val)" />
              </template>
              <template #form-element>
                <TextInput label="Overs Bowled" :value="player.overs"
                  :validations="[isValidNumber, (value) => maxLength(value, 4)]"
                  @update="(val) => updatePlayerField('overs', val)" />
              </template>
            </FormRowTwoItems>
            <FormRowTwoItems v-if="isBowling">
              <template #description>
                <TextInput label="Runs Conceded" :value="player.runs"
                  :validations="[isValidNumber, (value) => maxLength(value, 3)]" type="number"
                  @update="(val) => updatePlayerField('runs', val)" />
              </template>
              <template #form-element></template>
            </FormRowTwoItems>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="isEditModalOpen = false">Cancel</v-btn>
          <v-btn color="primary" @click="savePlayer">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list-item>
</template>

<script setup>
import { defineProps, defineEmits, ref, inject, computed } from "vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import FormRowTwoItems from "@/components/forms/structure/FormRowTwoItems.vue";
import TextInput from "@/pages/edit/AssetEditPortals/formElements/TextInput.vue";
import { useAccountStore } from "@/store/account";
import {
  isRequired,
  isValidName,
  isValidNumber,
  maxLength,
} from "@/pages/edit/validations/genericValidations";
// Inject global icons
const icons = inject("icons");

// Define component props
const props = defineProps({
  player: Object,
  index: Number,
  lastIndex: Number,
  assetType: String, // To determine if batting or bowling
});

// Define component events
const emit = defineEmits(["updatePlayerField", "savePlayer"]);

// State for the edit modal
const isEditModalOpen = ref(false);

// Access Pinia store and related state
const accountState = useAccountStore();
const isAssociation = computed(() => accountState.getAccountType === 2);
const getClubLogos = computed(() => accountState.getRelatedClubsLogos || []);

// Determine if the asset type is batting or bowling
const isBatting = computed(() => props.assetType === "CricketTop5Batting");
const isBowling = computed(() => props.assetType === "CricketTop5Bowling");

// Calculate the primary stat for display (runs for batting, wickets for bowling)
const primaryStat = computed(() =>
  isBatting.value
    ? `${props.player.runs} Runs`
    : `${props.player.wickets} Wickets`
);

// Helper to find the selected club name
const getSelectedClubName = computed(() => {
  const club = getClubLogos.value.find(
    (club) =>
      club.logo.url === props.player.teamLogo.url &&
      club.logo.width === props.player.teamLogo.width &&
      club.logo.height === props.player.teamLogo.height
  );
  return club ? club.name : null;
});

// Emit updated field values
function updatePlayerField(key, newValue) {
  emit("updatePlayerField", { index: props.index, key, newValue });
}

// Update logo and playedFor fields based on the selected club name
function updateLogoByName(newClubName) {
  const selectedClub = getClubLogos.value.find(
    (club) => club.name === newClubName
  );
  if (selectedClub && selectedClub.logo) {
    updatePlayerField("teamLogo", selectedClub.logo);
    updatePlayerField("playedFor", newClubName);
  } else {
    console.warn("Invalid club selected or missing logo:", newClubName);
  }
}

// Save player data after validation
function savePlayer() {
  emit("savePlayer", props.index);
  isEditModalOpen.value = false;
}

// Open the edit modal
function openEditModal() {
  isEditModalOpen.value = true;
}
</script>
