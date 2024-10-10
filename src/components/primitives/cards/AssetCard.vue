<template>
  <v-card class="mx-auto full-width mb-3" :color="theme" variant="flat">
    <v-img :src="image" class="rounded-md" />
    <v-card-actions class="d-flex flex-row justify-end pa-0 ma-0">
      <!-- Emit 'view' event with image URL as payload -->
      <IconButton
        size="x-small"
        color="accent-lighten1"
        :icon="icons.navigation.eye"
        variant="elevated"
        class="my-1"
        @click="$emit('view', image)"
      />

      <!-- Emit 'download' event with image URL as payload -->
      <IconButton
        size="x-small"
        color="accent-darken1"
        :icon="icons.assets.download"
        variant="elevated"
        class="my-1"
        @click="$emit('download', image)"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import { defineProps, inject } from "vue";
const icons = inject("icons");
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    default: "cardNeutral",
  },
});
</script>

<style scoped>
.full-width {
  width: 100%;
  /* Make the card full width */
}
</style>
