<template>
  <v-container
    :class="['elevation-0  rounded-sm ',bgColor, padding, margin]"
    variant="tonal"
  >
    <slot></slot>
  </v-container>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  margin: {
    type: String,
    default: "ma-0",
  },
  padding: {
    type: String,
    default: "pa-4",
  },
  bgColor:{
    type:String,
    default:'bg-grey-lighten-4'
  }
});
</script>
<style scoped></style>
