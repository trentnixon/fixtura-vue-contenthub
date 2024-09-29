<template>
  <v-card color="cardNeutral" variant="flat">
    <v-card-title>
      <slot name="title"></slot>
    </v-card-title>
    <v-card-subtitle>
      <slot name="subtitle"></slot>
    </v-card-subtitle>
    <v-card-text>
      <slot name="chart"></slot>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  color: {
    type: String,
    default: "cardNeutral",
  },
  variant: {
    type: String,
    default: "flat",
  },
});
</script>

<style scoped>
.chart {
  height: 300px;
}
</style>
