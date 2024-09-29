<template>
  <v-icon color="accent" class="mr-2" v-if="icon">{{ icon }}</v-icon>
  <div class="text-body mb-0 accent--text">{{ title }}</div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
  },
});
</script>
