<template>
  <v-text-field :label="label" v-model="internalValue" :error-messages="errorMessage" @blur="validateAndEmit"
    variant="outlined" clearable class="mb-0" />
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

// Define props and emits
const props = defineProps({
  label: String,
  value: String,
  validations: {
    type: Array, // Array of validation functions
    default: () => [],
  },
});
const emits = defineEmits(["update"]);

// Initialize the internal value for v-model compatibility
const internalValue = ref(props.value);
const errorMessage = ref("");
// Track if we're currently updating from a user input (to prevent prop watch from overriding)
let isUserInput = false;

// Watch for changes in the parent `value` prop to keep the internal state in sync
watch(
  () => props.value,
  (newValue) => {
    // Only update if the value is actually different AND it's not a user input
    // This prevents the prop watch from overriding user input while they're typing
    if (!isUserInput && internalValue.value !== newValue) {
      internalValue.value = newValue;
    }
  }
);

// Watch for changes in internalValue and emit updates to parent
// This keeps the parent in sync while the user is typing
watch(
  internalValue,
  (newValue) => {
    // Only emit if the value is different from the prop to avoid unnecessary updates
    if (newValue !== props.value) {
      isUserInput = true;
      emits("update", newValue);
      // Reset flag after a short delay to allow prop updates to come through
      setTimeout(() => {
        isUserInput = false;
      }, 100);
    }
  }
);

// Validate the input value
function validate(value) {
  for (const validation of props.validations) {
    // Skip if validation is not a function
    if (typeof validation !== 'function') {
      console.warn('[TextInput] Invalid validation function:', validation);
      continue;
    }
    const result = validation(value);
    if (result !== true) {
      errorMessage.value = result;
      return false;
    }
  }
  errorMessage.value = "";
  return true;
}

// Validate and emit on blur
// Always emit the value even if validation fails, so the user can see what they typed
// The validation error will still be displayed
function validateAndEmit() {
  // Validate to show/hide error message
  validate(internalValue.value);
  // Always emit the update, even if validation fails
  // This ensures the parent receives the value and the user can see their input
  emits("update", internalValue.value);
}
</script>

<style scoped>
.v-input {
  margin-bottom: 1rem;
}
</style>
