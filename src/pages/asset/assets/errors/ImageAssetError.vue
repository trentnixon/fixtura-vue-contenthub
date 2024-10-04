<!-- src/components/ImageAssetError.vue -->
<template>
  <v-card class="py-2 px-4 elevation-2 bg-surface-lighten1 rounded-md mt-4">
    <div class="d-flex justify-start align-center">
      <v-icon color="error" class="mr-2">mdi-image-off</v-icon>
      <span class="text-body-1"
        >Image failed to render for {{ asset.name }}.</span
      >
    </div>
    <v-btn color="primary" class="mt-2" @click="handleRerender"
      >Retry Render</v-btn
    >
  </v-card>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  asset: {
    type: Object,
    required: true,
  },
});

const handleRerender = () => {
  console.log("Rerender triggered for image asset", props.asset);
  // Add the rerender logic here (API call or any other logic needed)
};
</script>
