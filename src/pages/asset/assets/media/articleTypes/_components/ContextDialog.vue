<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600" persistent>
    <v-card>
      <v-card-title class="text-h6 d-flex align-center">
        <v-icon class="mr-2">mdi-information-outline</v-icon>
        Add Context for Article
      </v-card-title>
      <v-card-text>
        <div class="mb-4">
          <p class="text-body-2 mb-2">
            <strong>Instructions:</strong> This context applies to the <strong>entire article</strong>, not individual
            fixtures.
            Use this to provide overall guidance or information that affects the whole article.
          </p>
          <p class="text-caption text-grey">
            Examples: "Rain affected conditions throughout the weekend", "Finals week - significant match",
            "Club anniversary celebration", "Multiple key players returning from injury"
          </p>
        </div>

        <v-textarea
          :model-value="contextText"
          @update:model-value="$emit('update:contextText', $event)"
          label="Article Context"
          placeholder="Enter context that applies to the entire article..."
          :rows="6"
          :maxlength="maxLength"
          :counter="maxLength"
          variant="outlined"
          :disabled="isSaving"
          :error-messages="error"
          :success-messages="success"
          auto-grow
        />

        <div class="d-flex justify-space-between align-center mt-2">
          <span :class="['text-caption', charCountClass]">
            {{ charCount }} / {{ maxLength }} characters
            <span v-if="charRemaining < 100 && charRemaining >= 0">
              ({{ charRemaining }} remaining)
            </span>
          </span>
          <v-chip v-if="hasContext" color="success" size="small" variant="tonal">
            <v-icon start size="small">mdi-check-circle</v-icon>
            Context Saved
          </v-chip>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="hasContext"
          color="error"
          variant="text"
          @click="$emit('delete')"
          :disabled="isSaving"
        >
          Delete Context
        </v-btn>
        <SecondaryButton
          :label="cancelLabel"
          @click="$emit('close')"
          :disabled="isSaving"
        />
        <PrimaryButton
          label="Save Context"
          @click="$emit('save')"
          :loading="isSaving"
          :disabled="!isValid || isSaving"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";

defineProps<{
  modelValue: boolean;
  contextText: string;
  hasContext: boolean;
  isSaving: boolean;
  error?: string;
  success?: string;
  maxLength: number;
  charCount: number;
  charRemaining: number;
  charCountClass: string;
  isValid: boolean;
  cancelLabel: string;
}>();

defineEmits<{
  "update:modelValue": [value: boolean];
  "update:contextText": [value: string];
  save: [];
  delete: [];
  close: [];
}>();
</script>

