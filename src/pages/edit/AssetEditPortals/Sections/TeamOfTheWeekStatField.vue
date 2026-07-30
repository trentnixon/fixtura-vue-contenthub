<template>
  <TextInput
    v-if="
      field.inputType === 'number' ||
      field.inputType === 'decimal' ||
      field.inputType === 'text'
    "
    :label="field.label"
    :value="displayValue"
    :validations="fieldValidations"
    @update="onFieldUpdate"
  />
  <v-select
    v-else
    :label="field.label"
    :items="field.selectItems || []"
    :model-value="selectValue"
    @update:model-value="(val) => emit('update', field.path, val === 'Yes')"
    variant="outlined"
    density="compact"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import TextInput from "@/pages/edit/AssetEditPortals/formElements/TextInput.vue";
import {
  isValidNumber,
  maxLength,
} from "@/pages/edit/validations/genericValidations";
import type { TotwPlayer } from "@/types/TeamOfTheWeek";
import {
  getNestedValue,
  type TotwStatFieldConfig,
} from "@/pages/edit/composables/useTotwPlayerStats";

const props = defineProps<{
  field: TotwStatFieldConfig;
  player: TotwPlayer;
}>();

const emit = defineEmits<{
  update: [path: string, value: unknown];
}>();

const fieldValue = computed(() =>
  getNestedValue(props.player as unknown as Record<string, unknown>, props.field.path)
);

const displayValue = computed(() => {
  const value = fieldValue.value;
  if (value === undefined || value === null) return "";
  return String(value);
});

const fieldValidations = computed(() => {
  const validators: Array<(value: string | number) => string | true> = [];

  if (props.field.inputType === "number" || props.field.inputType === "decimal") {
    validators.push(isValidNumber);
  }

  const maxLen = props.field.maxLength;
  if (maxLen) {
    validators.push((value) => maxLength(String(value), maxLen));
  }

  return validators;
});

const selectValue = computed(() => (fieldValue.value ? "Yes" : "No"));

function onFieldUpdate(val: string) {
  if (props.field.inputType === "text") {
    emit("update", props.field.path, val);
    return;
  }

  if (val === "") {
    emit("update", props.field.path, undefined);
    return;
  }

  const parsed =
    props.field.inputType === "decimal" ? parseFloat(val) : Number(val);
  emit("update", props.field.path, Number.isNaN(parsed) ? undefined : parsed);
}
</script>
