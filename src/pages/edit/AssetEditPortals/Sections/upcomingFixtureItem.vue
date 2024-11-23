<template>
  <v-list-item class="my-2 border pa-2">
    <!-- Fixture Display -->
    <v-list-item-content>
      <v-list-item-title
        >{{ fixture.teamHome }} vs {{ fixture.teamAway }}</v-list-item-title
      >
      <v-list-item-subtitle>{{ fixture.gradeName }}</v-list-item-subtitle>
    </v-list-item-content>
    <template v-slot:prepend>
      <v-avatar>
        <v-icon>{{ icons.ui.grab }}</v-icon>
      </v-avatar>
    </template>
    <template v-slot:append>
      <IconButton
        :icon="icons.ui.edit"
        color="success"
        @click="openEditModal"
        variant="tonal"
        size="small"
        tooltip="Edit Fixture"
      />
    </template>

    <!-- Modal -->
    <v-dialog v-model="isEditModalOpen" max-width="600">
      <v-card>
        <v-card-title>Edit Fixture</v-card-title>
        <v-card-text>
          <p class="card-title">The Teams</p>

          <v-container class="pa-0 mt-4">
            <FormRowTwoItems>
              <template #description>
                <TextInput
                  label="Team Home"
                  :value="fixture.teamHome"
                  :validations="[isValidName, isRequired]"
                  @update="(val) => updateFixtureField('teamHome', val)"
                />
              </template>

              <template #form-element>
                <TextInput
                  label="Team Away"
                  :value="fixture.teamAway"
                  :validations="[isValidName, isRequired]"
                  @update="(val) => updateFixtureField('teamAway', val)"
                />
              </template>
            </FormRowTwoItems>
          </v-container>
          <p class="card-title">Fixtures Information</p>
          <v-container class="pa-0 mt-4">
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
                  label="Grade Name"
                  :value="fixture.gradeName"
                  :validations="[isValidName]"
                  @update="(val) => updateFixtureField('gradeName', val)"
                />
              </template>
            </FormRowTwoItems>
            <FormRowTwoItems>
              <template #description>
                <TextInput
                  label="Round"
                  :validations="[isValidName]"
                  :value="fixture.round"
                  @update="(newRound) => updateFixtureField('round', newRound)"
                />
              </template>

              <template #form-element>
                <TextInput
                  label="Date"
                  :validations="[isDate]"
                  :value="fixture.date"
                  @update="(newDate) => updateFixtureField('date', newDate)"
                />
              </template>
            </FormRowTwoItems>
            <FormRowTwoItems>
              <template #description>
                <TextInput
                  label="Time"
                  :value="fixture.time"
                  :validations="[isTime]"
                  @update="(newTime) => updateFixtureField('time', newTime)"
                />
              </template>

              <template #form-element> </template>
            </FormRowTwoItems>
          </v-container>

          <p class="card-title">About the Fixture</p>
          <v-container class="pa-0 mt-4">
            <FormRowTwoItems>
              <template #description>
                <TextInput
                  label="Type"
                  :validations="[isValidName]"
                  :value="fixture.type"
                  @update="(newType) => updateFixtureField('type', newType)"
                />
              </template>

              <template #form-element>
                <TextInput
                  label="Gender"
                  :validations="[isValidName]"
                  :value="fixture.gender"
                  @update="
                    (newGender) => updateFixtureField('gender', newGender)
                  "
                />
              </template>
            </FormRowTwoItems>
            <FormRowTwoItems>
              <template #description>
                <TextInput
                  label="Age Group"
                  :value="fixture.ageGroup"
                  @update="
                    (newAgeGroup) => updateFixtureField('ageGroup', newAgeGroup)
                  "
                />
              </template>

              <template #form-element> </template>
            </FormRowTwoItems>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="isEditModalOpen = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveFixture">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list-item>
</template>

<script setup>
import { defineProps, defineEmits, inject, ref } from "vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import FormRowTwoItems from "@/components/forms/structure/FormRowTwoItems.vue";
import TextInput from "@/pages/edit/AssetEditPortals/formElements/TextInput.vue";
import {
  isDate,
  isRequired,
  isTime,
  isValidName,
} from "@/pages/edit/validations/genericValidations";

const icons = inject("icons");
const props = defineProps({
  fixture: Object,
  index: Number,
  lastIndex: Number,
});

const emit = defineEmits(["updateFixtureField", "saveFixture"]);

const isEditModalOpen = ref(false);

function updateFixtureField(key, newValue) {
  emit("updateFixtureField", { index: props.index, key, newValue });
}

function saveFixture() {
  emit("saveFixture", props.index);
  isEditModalOpen.value = false;
}

function openEditModal() {
  isEditModalOpen.value = true;
}
</script>
<style scoped>
/* Default state: cursor is a hand (pointer) */
.v-list-item {
  cursor: grab;
  transition: transform 0.2s ease-in-out;
}

/* Mouse-down state: cursor changes to grabbing */
.v-list-item:active {
  cursor: grabbing;
  transform: scale(1.03); /* Slightly enlarge for visual feedback */
}

/* Optional: Add some hover effect */
.v-list-item:hover {
  background-color: #f5f5f5; /* Light background on hover */
}
</style>
