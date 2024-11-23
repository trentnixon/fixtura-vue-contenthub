<template>
  <v-list-item class="my-2 border pa-2">
    <!-- Fixture Display -->
    <v-list-item-content>
      <v-list-item-title>
        {{ fixture.homeTeam.name }} vs {{ fixture.awayTeam.name }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ fixture.ground }} | {{ fixture.date }}
      </v-list-item-subtitle>
    </v-list-item-content>

    <!-- Prepend: Fixture Icon -->
    <template v-slot:prepend>
      <v-avatar>
        <v-icon>{{ icons.ui.grab }}</v-icon>
      </v-avatar>
    </template>

    <!-- Append: Edit Buttons -->
    <template v-slot:append>
      <!-- Edit Result Modal -->
      <IconButton
        :icon="icons.ui.metaData"
        color="success"
        @click="openModal('result')"
        variant="tonal"
        size="small"
        tooltip="Edit Result"
      />
      &nbsp;
      <!-- Edit Innings 1 Modal -->
      <IconButton
        :icon="icons.ui.home"
        color="primary"
        @click="openModal('innings1')"
        variant="tonal"
        size="small"
        tooltip="Edit Home Team Innings"
      />&nbsp;
      <!-- Edit Innings 2 Modal -->
      <IconButton
        :icon="icons.ui.away"
        color="secondary"
        @click="openModal('innings2')"
        variant="tonal"
        size="small"
        tooltip="Edit Away Team Innings"
      />
    </template>

    <!-- Result Modal -->
    <v-dialog v-model="isResultModalOpen" max-width="800">
      <v-card>
        <v-card-title>Edit Fixture Result</v-card-title>
        <v-card-text>
          <!-- Team Scores -->
          <p class="card-title mb-4">Team Scores</p>
          <v-container class="pa-0">
            <FormRowTwoItems>
              <template #description>
                <TextInput
                  label="Home Team"
                  :value="fixture.homeTeam.name"
                  :validations="[isValidName, isRequired]"
                  @update="(val) => updateFixtureField('homeTeam.name', val)"
                />
              </template>
              <template #form-element>
                <TextInput
                  label="Home Team Score"
                  :value="fixture.homeTeam.score"
                  :validations="[isValidName]"
                  @update="(val) => updateFixtureField('homeTeam.score', val)"
                />
              </template>
            </FormRowTwoItems>
            <FormRowTwoItems>
              <template #description>
                <TextInput
                  label="Away Team"
                  :value="fixture.awayTeam.name"
                  :validations="[isValidName, isRequired]"
                  @update="(val) => updateFixtureField('awayTeam.name', val)"
                />
              </template>
              <template #form-element>
                <TextInput
                  label="Away Team Score"
                  :value="fixture.awayTeam.score"
                  :validations="[isValidName]"
                  @update="(val) => updateFixtureField('awayTeam.score', val)"
                />
              </template>
            </FormRowTwoItems>
          </v-container>

          <!-- Fixture Details -->
          <v-container class="pa-0">
            <p class="card-title mb-4">Fixture Details</p>
            <TextInput
              label="Result"
              :value="fixture.result"
              :validations="[isValidName, isRequired]"
              @update="(val) => updateFixtureField('result', val)"
            />
            <FormRowTwoItems>
              <template #description>
                <TextInput
                  label="Ground"
                  :value="fixture.ground"
                  :validations="[isValidName]"
                  @update="(val) => updateFixtureField('ground', val)"
                />
              </template>
              <template #form-element>
                <TextInput
                  label="Date"
                  :value="fixture.date"
                  :validations="[isDate]"
                  @update="(val) => updateFixtureField('date', val)"
                />
              </template>
            </FormRowTwoItems>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="closeModal('result')">Cancel</v-btn>
          <v-btn color="primary" @click="saveFixture">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Innings 1 Modal -->
    <v-dialog v-model="isInnings1ModalOpen" max-width="800">
      <v-card>
        <v-card-title>Home Team Editor</v-card-title>
        <v-card-text>
          <PerformanceEditor
            :performances="fixture.homeTeam.battingPerformances"
            type="batting"
            @update="
              (updatedPerformances) =>
                updateFixtureField(
                  'homeTeam.battingPerformances',
                  updatedPerformances
                )
            "
          />

          <PerformanceEditor
            :performances="fixture.awayTeam.bowlingPerformances"
            type="bowling"
            @update="
              (updatedPerformances) =>
                updateFixtureField(
                  'awayTeam.bowlingPerformances',
                  updatedPerformances
                )
            "
          />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeModal('innings1')">Cancel</v-btn>
          <v-btn color="primary" @click="saveFixture">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Innings 2 Modal -->
    <v-dialog v-model="isInnings2ModalOpen" max-width="800">
      <v-card>
        <v-card-title>Away Team Editor</v-card-title>
        <v-card-text>
          <p class="card-title mb-4">Away Team Batting</p>
          <PerformanceEditor
            :performances="fixture.awayTeam.battingPerformances"
            type="batting"
            @update="
              (updatedPerformances) =>
                updateFixtureField(
                  'awayTeam.battingPerformances',
                  updatedPerformances
                )
            "
          />
          <p class="card-title mb-4">Home Team Bowling</p>
          <PerformanceEditor
            :performances="fixture.homeTeam.bowlingPerformances"
            type="bowling"
            @update="
              (updatedPerformances) =>
                updateFixtureField(
                  'homeTeam.bowlingPerformances',
                  updatedPerformances
                )
            "
          />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeModal('innings2')">Cancel</v-btn>
          <v-btn color="primary" @click="saveFixture">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list-item>
</template>

<script setup>
import { defineProps, defineEmits, inject, ref } from "vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import TextInput from "@/pages/edit/AssetEditPortals/formElements/TextInput.vue";
import PerformanceEditor from "@/pages/edit/AssetEditPortals/formElements/PerformanceEditor.vue";
import {
  isValidName,
  isRequired,
} from "@/pages/edit/validations/genericValidations";
import FormRowTwoItems from "@/components/forms/structure/FormRowTwoItems.vue";

const icons = inject("icons");

const props = defineProps({
  fixture: Object,
  index: Number,
});

const emit = defineEmits(["updateFixtureField", "saveFixture"]);

// Modal states
const isResultModalOpen = ref(false);
const isInnings1ModalOpen = ref(false);
const isInnings2ModalOpen = ref(false);

// Open specific modal
function openModal(modal) {
  if (modal === "result") isResultModalOpen.value = true;
  if (modal === "innings1") isInnings1ModalOpen.value = true;
  if (modal === "innings2") isInnings2ModalOpen.value = true;
}

// Close specific modal
function closeModal(modal) {
  if (modal === "result") isResultModalOpen.value = false;
  if (modal === "innings1") isInnings1ModalOpen.value = false;
  if (modal === "innings2") isInnings2ModalOpen.value = false;
}

// Update field in the fixture object
function updateFixtureField(key, value) {
  const keys = key.split(".");
  let obj = props.fixture;

  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }

  obj[keys[keys.length - 1]] = value;
  emit("updateFixtureField", { index: props.index, key, value });
}

// Save fixture
function saveFixture() {
  emit("saveFixture", props.index);
}
</script>

<style scoped>
.v-list-item {
  cursor: grab;
  transition: transform 0.2s ease-in-out;
}
.v-list-item:active {
  cursor: grabbing;
  transform: scale(1.01);
}
.v-list-item:hover {
  background-color: #f5f5f5;
}
</style>
