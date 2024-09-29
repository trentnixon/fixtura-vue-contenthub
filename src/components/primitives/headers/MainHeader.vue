<template>
  <div class="text-leading" v-if="subtitle">{{ subtitle }}</div>
  <div class="text-title">{{ title }}</div>
</template>

<script setup>
//text-h4 mt-0 mb-1
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
