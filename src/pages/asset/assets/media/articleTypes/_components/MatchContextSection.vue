<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <v-icon class="mr-2">mdi-calendar-text</v-icon>
      Match Context
    </v-expansion-panel-title>
    <v-expansion-panel-text style="padding-left: 0px; padding-right: 0px;">
      <div class="row">
        <div class="col-md-6 mb-3">
          <v-text-field :model-value="matchContext.round" @update:model-value="updateField('round', $event)"
            label="Round" variant="outlined" density="compact" />
        </div>
        <div class="col-md-6 mb-3">
          <v-text-field :model-value="matchContext.ground" @update:model-value="updateField('ground', $event)"
            label="Ground" variant="outlined" density="compact" />
        </div>
        <div class="col-md-6 mb-3">
          <v-text-field :model-value="matchContext.tossWinner" @update:model-value="updateField('tossWinner', $event)"
            label="Who won the Toss" variant="outlined" density="compact" />
        </div>
        <div class="col-md-12 mb-3">
          <v-textarea :model-value="matchContext.tossResult" @update:model-value="updateField('tossResult', $event)"
            label="Who batted First" variant="outlined" density="compact" rows="2" />
        </div>
        <div class="col-md-12 mb-3">
          <v-textarea :model-value="displayResultStatement" @update:model-value="updateField('resultStatement', $event)"
            label="What is the current or final result" variant="outlined" density="compact" rows="2" />
        </div>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { MatchContext } from "@/types/FixtureTypes";
import type { ValidationRule } from "../_composables/useFixtureValidation";

const props = defineProps<{
  matchContext: MatchContext;
  validationRules: {
    requiredRule: ValidationRule;
    dateRule: ValidationRule;
  };
}>();

const emit = defineEmits<{
  "update:matchContext": [value: MatchContext];
}>();

// Strip " batted first" suffix when displaying in input field
const displayResultStatement = computed(() => {
  const value = props.matchContext.resultStatement || '';
  if (!value) return '';

  // Remove " batted first" suffix if present
  const trimmed = value.trim();
  if (trimmed.toLowerCase().endsWith(' batted first')) {
    return trimmed.slice(0, -13).trim(); // Remove " batted first" (13 characters)
  }
  // Also check for "the team to bat first was" prefix format
  const lowerValue = trimmed.toLowerCase();
  if (lowerValue.startsWith('the team to bat first was ')) {
    return trimmed.slice(28).trim(); // Remove "the team to bat first was " (28 characters)
  }

  return value;
});

function updateField<K extends keyof MatchContext>(field: K, value: MatchContext[K]) {
  // Format resultStatement to add suffix for team name when saving
  if (field === 'resultStatement' && typeof value === 'string' && value.trim()) {
    const trimmedValue = value.trim();
    // Check if it already has the format (to avoid double-formatting)
    const hasBattedFirst = trimmedValue.toLowerCase().includes('batted first');
    const hasTeamToBat = trimmedValue.toLowerCase().includes('the team to bat first was');

    if (!hasBattedFirst && !hasTeamToBat) {
      // Add suffix: "* batted first"
      value = `${trimmedValue} batted first` as MatchContext[K];
    }
  }

  emit("update:matchContext", {
    ...props.matchContext,
    [field]: value,
  });
}
</script>
