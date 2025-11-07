<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <v-icon class="mr-2">{{ teamType === 'homeTeam' ? 'mdi-home' : 'mdi-account-group' }}</v-icon>
      {{ teamType === 'homeTeam' ? 'Home Team' : 'Away Team' }}
    </v-expansion-panel-title>
    <v-expansion-panel-text style="padding-left: 0px; padding-right: 0px;">
      <div class="team-edit-form">
        <div class="row mb-3">
          <div class="col-md-12">
            <v-text-field :model-value="team.teamName" @update:model-value="updateField('teamName', $event)"
              label="Team Name *" :rules="[validationRules.requiredRule]" variant="outlined" density="compact" />
          </div>
        </div>
        <v-divider class="my-4"></v-divider>
        <template v-if="team.innings">
          <InningsSection v-for="(inning, inningIndex) in team.innings" :key="inningIndex" :inning="inning"
            @update:inning="updateInning(inningIndex, $event)" @add-player="$emit('add-player', inningIndex)"
            @remove-player="(playerIndex) => $emit('remove-player', inningIndex, playerIndex)"
            @add-bowler="$emit('add-bowler', inningIndex)"
            @remove-bowler="(bowlerIndex) => $emit('remove-bowler', inningIndex, bowlerIndex)"
            @add-fielder="$emit('add-fielder', inningIndex)"
            @remove-fielder="(fielderIndex) => $emit('remove-fielder', inningIndex, fielderIndex)" />
        </template>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import type { Team } from "@/types/FixtureTypes";
import type { ValidationRule } from "../_composables/useFixtureValidation";
import InningsSection from "./InningsSection.vue";

const props = defineProps<{
  team: Team;
  teamType: "homeTeam" | "awayTeam";
  validationRules: {
    requiredRule: ValidationRule;
  };
}>();

const emit = defineEmits<{
  "update:team": [value: Team];
  "add-player": [inningIndex: number];
  "remove-player": [inningIndex: number, playerIndex: number];
  "add-bowler": [inningIndex: number];
  "remove-bowler": [inningIndex: number, bowlerIndex: number];
  "add-fielder": [inningIndex: number];
  "remove-fielder": [inningIndex: number, fielderIndex: number];
}>();

function updateField<K extends keyof Team>(field: K, value: Team[K]) {
  emit("update:team", {
    ...props.team,
    [field]: value,
  });
}

function updateInning(inningIndex: number, updatedInning: any) {
  const updatedInnings = [...props.team.innings];
  updatedInnings[inningIndex] = updatedInning;
  emit("update:team", {
    ...props.team,
    innings: updatedInnings,
  });
}
</script>
