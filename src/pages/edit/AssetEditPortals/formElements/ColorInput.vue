<template>
  <v-text-field
    :label="label"
    v-model="internalValue"
    type="color"
    @blur="updateValue"
    clearable
    :messages="messages ? messages : ''"
    :hide-details="true"
    variant="outlined"
    class="mb-0"
  />
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  label: String,
  value: String,
});
const emits = defineEmits(["update"]);

const internalValue = ref(props.value);

watch(
  () => props.value,
  (newValue) => {
    internalValue.value = newValue;
  }
);

function updateValue() {
  emits("update", internalValue.value);
}
</script>

<style scoped>
.v-input {
  margin-bottom: 1rem;
}
</style>
