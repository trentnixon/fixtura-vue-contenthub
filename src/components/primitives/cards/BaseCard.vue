<template>
  <v-card class="mx-auto my-0 pa-3 bg-white" variant="flat" >
    <v-card-title class="font-weight-bold primary--text">
      <slot name="title">Default Title</slot>
    </v-card-title>
    <v-card-subtitle class="font-italic grey--text text--darken-1">
      <slot name="subtitle">Default Subtitle</slot>
    </v-card-subtitle>
    <v-card-text class="body-2">
      <slot name="text">Default Content</slot>
    </v-card-text>
    <v-card-actions>
      <slot name="actions"> </slot>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
// Pinia

// Emit an event when an action is clicked
</script>

<style scoped></style>
