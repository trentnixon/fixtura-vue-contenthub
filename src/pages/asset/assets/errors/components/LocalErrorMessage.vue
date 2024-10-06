<template>
  <div class="d-flex justify-start align-center pa-4">
    <v-icon color="error" class="mr-4">mdi-video-off</v-icon>
    <div class="text-body">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line
const props = defineProps({
  errorMessage: {
    type: String,
    required: true,
  },
});
</script>
