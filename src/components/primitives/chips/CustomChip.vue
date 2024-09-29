<template>
  <v-chip class="ma-2" :color="chipColor" label>
    <v-icon v-if="type === 'boolean'" :icon="icon" start></v-icon>
    <v-icon v-if="type !== 'boolean'" :icon="icon" start></v-icon>
    {{ label }}
  </v-chip>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [Boolean, String, Number],
    required: true,
  },
  type: {
    type: String,
    default: "text", // 'boolean' or 'text'
  },
  icon: {
    type: String,
    default: "", // If no icon is provided for text type, it will default to none
  },
});

const icon = computed(() => {
  if (props.type === "boolean") {
    return props.value ? "mdi-check" : "mdi-close";
  }
  return props.icon;
});

const chipColor = computed(() => {
  if (props.type === "boolean") {
    return props.value ? "success" : "error";
  }
  return "primary";
});
</script>
