<template>
  <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md mb-4">
    <div class="card-title py-2 px-4">{{ title }}</div>
    <v-card class="pa-2 elevation-0 bg-neutral rounded-md">
      <v-container class="pa-0">
        <!-- Loop through performances -->
        <v-row
          v-for="(performance, index) in performances"
          :key="index"
          class="bg-surface rounded-md ma-2 mb-3 elevation-3"
        >
          <!-- Player Name -->
          <v-col cols="12">
            <TextInput
              label="Player Name"
              :value="performance.player"
              :validations="[isValidName, isRequired]"
              @update="(val) => updatePerformanceField(index, 'player', val)"
            />
          </v-col>

          <!-- Conditional Fields for Batting -->
          <template v-if="type === 'batting'">
            <v-col cols="6" sm="3">
              <TextInput
                label="Runs"
                :value="performance.runs"
                :validations="[isNumber]"
                @update="(val) => updatePerformanceField(index, 'runs', val)"
              />
            </v-col>
            <v-col cols="6" sm="3">
              <TextInput
                label="Balls"
                :value="performance.balls"
                :validations="[isNumber]"
                @update="(val) => updatePerformanceField(index, 'balls', val)"
              />
            </v-col>
            <v-col cols="6" sm="3">
              <TextInput
                label="Strike Rate"
                :value="performance.SR"
                :validations="[isNumber]"
                @update="(val) => updatePerformanceField(index, 'SR', val)"
              />
            </v-col>
            <v-col cols="6" sm="3">
              <v-select
                label="Not Out"
                :items="['Yes', 'No']"
                :value="performance.notOut ? 'Yes' : 'No'"
                @update:model-value="
                  (val) =>
                    updatePerformanceField(index, 'notOut', val === 'Yes')
                "
              />
            </v-col>
          </template>

          <!-- Conditional Fields for Bowling -->
          <template v-if="type === 'bowling'">
            <v-col cols="6" sm="2">
              <TextInput
                label="Overs"
                :value="performance.overs"
                :validations="[isNumber]"
                @update="(val) => updatePerformanceField(index, 'overs', val)"
              />
            </v-col>
            <v-col cols="6" sm="2">
              <TextInput
                label="Maidens"
                :value="performance.maidens || 0"
                :validations="[isNumber]"
                @update="(val) => updatePerformanceField(index, 'maidens', val)"
              />
            </v-col>
            <v-col cols="6" sm="3">
              <TextInput
                label="Runs"
                :value="performance.runs"
                :validations="[isNumber]"
                @update="(val) => updatePerformanceField(index, 'runs', val)"
              />
            </v-col>
            <v-col cols="6" sm="2">
              <TextInput
                label="Wickets"
                :value="performance.wickets"
                :validations="[isNumber]"
                @update="(val) => updatePerformanceField(index, 'wickets', val)"
              />
            </v-col>
            <v-col cols="6" sm="3">
              <TextInput
                label="Economy"
                :value="performance.economy"
                :validations="[isNumber]"
                @update="(val) => updatePerformanceField(index, 'economy', val)"
              />
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-card>
  </v-card>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import TextInput from "@/pages/edit/AssetEditPortals/formElements/TextInput.vue";
import {
  isValidName,
  isRequired,
  isNumber,
} from "@/pages/edit/validations/genericValidations";

const props = defineProps({
  performances: {
    type: Array,
    required: true, // Batting or Bowling performances
  },
  type: {
    type: String,
    required: true, // 'batting' or 'bowling'
  },
});

const emits = defineEmits(["update"]);

const title =
  props.type === "batting" ? "Batting Performances" : "Bowling Performances";

// Update a specific field in the performance object
function updatePerformanceField(index, key, value) {
  const updatedPerformances = [...props.performances];
  updatedPerformances[index][key] = value;
  emits("update", updatedPerformances);
}
</script>

<style scoped>
.v-card-title {
  font-size: 18px;
  font-weight: bold;
}
</style>
