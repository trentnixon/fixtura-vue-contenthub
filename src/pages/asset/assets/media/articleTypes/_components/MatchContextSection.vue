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
            label="Toss Winner" variant="outlined" density="compact" />
        </div>
        <div class="col-md-12 mb-3">
          <v-textarea :model-value="matchContext.tossResult" @update:model-value="updateField('tossResult', $event)"
            label="Toss Result" variant="outlined" density="compact" rows="2" />
        </div>
        <div class="col-md-12 mb-3">
          <v-textarea :model-value="matchContext.resultStatement"
            @update:model-value="updateField('resultStatement', $event)" label="Result Statement" variant="outlined"
            density="compact" rows="2" />
        </div>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
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

function updateField<K extends keyof MatchContext>(field: K, value: MatchContext[K]) {
  emit("update:matchContext", {
    ...props.matchContext,
    [field]: value,
  });
}
</script>
