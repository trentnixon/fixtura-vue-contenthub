<template>
  <v-select
    :label="label"
    :items="options"
    v-model="internalValue"
    :error-messages="errors"
    @change="updateValue"
    clearable
  />
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const props = defineProps({
  label: String,
  value: String,
  options: Array,
});
const emits = defineEmits(["update"]);

const internalValue = ref(props.value);

// Vuelidate setup
const rules = { value: { required } };
const v$ = useVuelidate(rules, { value: internalValue });

const errors = computed(() =>
  v$.$dirty ? v$.$errors.map((e) => e.$message) : []
);

function updateValue() {
  v$.$touch();
  if (!v$.$invalid) emits("update", internalValue.value);
}
</script>
