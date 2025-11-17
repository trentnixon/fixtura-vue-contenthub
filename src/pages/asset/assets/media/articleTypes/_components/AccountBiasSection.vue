<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <v-icon class="mr-2">mdi-account-star</v-icon>
      Report Bias
    </v-expansion-panel-title>
    <v-expansion-panel-text style="padding-left: 8px; padding-right: 8px;">
      <div class="row">
        <div class="col-md-12 mb-3">
          <v-text-field :model-value="accountBias?.isBias" @update:model-value="updateField('isBias', $event)"
            label="Is Bias" variant="outlined" density="compact" />
        </div>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import type { AccountBias } from "@/types/FixtureTypes";

const props = defineProps<{
  accountBias?: AccountBias; // Optional - associations won't have accountBias
}>();

const emit = defineEmits<{
  "update:accountBias": [value: AccountBias];
}>();

function updateField<K extends keyof AccountBias>(field: K, value: AccountBias[K]) {
  if (!props.accountBias) return;
  emit("update:accountBias", {
    ...props.accountBias,
    [field]: value,
  });
}
</script>
