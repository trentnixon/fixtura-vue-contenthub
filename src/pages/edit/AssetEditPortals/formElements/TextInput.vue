<template>
  <v-text-field
    :label="label"
    v-model="internalValue"
    :error-messages="errorMessage"
    @blur="validateAndEmit"
    variant="outlined"
    clearable
    class="mb-0"
  />
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

// Watch for changes in the parent `value` prop to keep the internal state in sync
watch(
  () => props.value,
  (newValue) => {
    internalValue.value = newValue;
  }
);

// Validate the input value
function validate(value) {
  for (const validation of props.validations) {
    const result = validation(value);
    if (result !== true) {
      errorMessage.value = result;
      return false;
    }
  }
  errorMessage.value = "";
  return true;
}

// Emit the updated value and validate on blur
function validateAndEmit() {
  if (validate(internalValue.value)) {
    emits("update", internalValue.value);
  }
}
</script>

<style scoped>
.v-input {
  margin-bottom: 1rem;
}
</style>
