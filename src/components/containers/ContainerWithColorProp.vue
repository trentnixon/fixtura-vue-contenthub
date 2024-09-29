<template>
  <v-container
    :class="['elevation-0 ma-0  rounded-sm', padding, bgColor, margin]"
    variant="tonal"
  >
    <slot></slot>
  </v-container>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  bgColor: {
    type: String,
    default: "surface",
  },
  padding: {
    type: String,
    default: "pa-4",
  },
  margin: {
    type: String,
    default: "my-4",
  },
});
</script>

<style scoped></style>
