<template>
  <div class="card-title">{{ title }}</div>
  <div class="card-subtitle" v-if="subtitle">{{ subtitle }}</div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
  },
});
</script>
