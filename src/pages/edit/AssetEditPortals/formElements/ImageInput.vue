<template>
  <div class="d-flex flex-no-wrap align-center">
    <v-text-field
      :label="label"
      v-model="internalValue"
      :error-messages="errors ? errors : []"
      @blur="updateValue"
      clearable
      variant="outlined"
      :messages="messages ? messages : ''"
      :hide-details="true"
      class="mb-0"
    />
    <v-img v-if="validUrl" :src="internalValue" max-width="50" class="mt-2" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, url } from "@vuelidate/validators";

// Define props and emits
const props = defineProps({
  label: String,
  value: String,
});
const emits = defineEmits(["update"]);

// Initialize the internal value for v-model compatibility
const internalValue = ref(props.value);

// Regular expression to check if the value is a valid URL
const validUrl = computed(() =>
  /^(ftp|http|https):\/\/[^ "]+$/.test(internalValue.value)
);

// Vuelidate setup
const rules = { internalValue: { required, url } };
const v$ = useVuelidate(rules, { internalValue });

// Watch for changes in the parent `value` prop to keep the internal state in sync
watch(
  () => props.value,
  (newValue) => {
    internalValue.value = newValue;
  }
);

// Safe handling for errors
const errors = computed(() => {
  return v$.value?.internalValue?.$errors?.map((error) => error.$message) || [];
});

// Emit the updated value after validation passes on blur
function updateValue() {
  v$.value?.internalValue?.$touch();
  if (!v$.value?.internalValue?.$invalid) {
    emits("update", internalValue.value);
  }
}
</script>

<style scoped>
.mt-2 {
  margin-top: 1rem;
}
</style>
