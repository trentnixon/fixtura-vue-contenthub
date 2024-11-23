<template>
  <v-col cols="12" class="pa-1 mb-4">
    <v-row>
      <!-- Slot for Description -->
      <v-col
        cols="12"
        sm="6"
        class="pa-1 d-flex justify-start content-center align-center sm:justify-center sm:content-center sm:align-center"
      >
        <slot name="description"></slot>
      </v-col>

      <!-- Slot for Form Element -->
      <v-col cols="12" sm="6" class="pa-1">
        <slot name="form-element"></slot>
      </v-col>
    </v-row>
  </v-col>
</template>

<script setup>
// No need for additional script logic, as this component
// simply provides a layout structure for two slots
</script>

<style scoped>
/* Optional scoped styles */
</style>
