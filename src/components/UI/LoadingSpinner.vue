<template>
  <v-container fluid>
    <v-skeleton-loader :type="type" />
  </v-container>
</template>

<script setup>
// Define the props and set a default value for the type prop
const props = defineProps({
  type: {
    type: String,
    default: "table", // Default value for the type prop
  },
});
</script>
