<template>
    <v-alert type="error" dismissible>
      {{ message }}
    </v-alert>
  </template>

  <script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    message: {
      type: String,
      required: true,
      default: "An error occurred. Please try again.",
    },
  });
  </script>

  <style scoped>
  /* You can style your error component here */
  </style>
