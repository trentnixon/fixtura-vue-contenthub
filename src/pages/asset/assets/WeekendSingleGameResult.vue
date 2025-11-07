<template>
  <!-- Header with Apply Edits Button -->
  <v-container v-if="asset && asset.editTrigger" class="pa-0 mt-4" fluid>
    <div class="d-flex justify-end align-center">
      <PrimaryButton
        v-if="canRetry"
        color="success"
        label="Apply Edits"
        @click="handleRerender"
        :loading="isRerendering"
        :disabled="!canRetry || isRerendering"
        size="small"
      />
    </div>
  </v-container>

  <!-- Asset Images with View/Download Options -->
  <v-container class="pa-0 mt-6" fluid>
    <!-- Loading State while processing -->
    <template v-if="isPolling || isRerendering">
      <v-row>
        <v-col v-for="n in 3" :key="n" cols="12" sm="6" md="4" class="mb-4">
          <v-skeleton-loader color="surface" type="card" />
        </v-col>
      </v-row>
    </template>

    <!-- Images Display -->
    <template v-else>
      <v-row>
        <v-col v-for="(img, idx) in props.formattedAssets[0]?.downloads || []" :key="idx" cols="12" sm="6" md="4"
          class="mb-4">
          <v-card class="mx-auto" elevation="0">
            <v-img :src="img" :alt="`Asset Image ${idx + 1}`" aspect-ratio="16/9" cover class="rounded" />
            <v-card-actions class="d-flex flex-row justify-end pa-2">
              <!-- View Button -->
              <IconButton size="x-small" color="accent-lighten1" icon="mdi-eye" variant="elevated" class="mr-1"
                @click="viewImage(img)" />
              <!-- Download Button -->
              <IconButton size="x-small" color="accent-darken1" icon="mdi-download" variant="elevated" class="ml-1"
                @click="downloadImage(img)" />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>

  <!-- Image View Modal -->
  <v-dialog v-model="isModalOpen" max-width="90vw" max-height="90vh" transition="dialog-bottom-transition">
    <v-card>
      <v-img :src="currentImage" :aspect-ratio="4 / 5" class="bg-grey-lighten-2" cover>
        <v-container class="d-flex justify-end">
          <IconButton size="x-small" color="success" icon="mdi-download" class="mr-1" variant="elevated"
            @click="downloadImage(currentImage)" />
          <IconButton size="x-small" color="error" icon="mdi-close" variant="elevated" @click="isModalOpen = false" />
        </v-container>
      </v-img>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, ref, computed } from "vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import { useImageDownloads } from "@/pages/asset/composables/useImageDownloads.js";
import { useAssetRerender } from "@/pages/asset/assets/errors/composables/useRerender";

// Define component props
const props = defineProps({
  formattedAssets: Array, // Images related to the fixtures
  formattedArticles: Array, // Articles related to the fixtures
});

// Image downloads functionality
const {
  isModalOpen,
  currentImage,
  downloadImage,
  viewImage,
} = useImageDownloads();

// Get the asset from formattedAssets (first asset with editTrigger)
const asset = computed(() => {
  return props.formattedAssets?.[0] || null;
});

// State for whether the user can retry
const canRetry = ref(true);

// Composable handling rerender logic
const { triggerRerender, isRerendering, rerenderResponse, isPolling } = useAssetRerender();

const handleRerender = async () => {
  if (!asset.value) return;

  canRetry.value = false; // Disable retry button
  await triggerRerender(asset.value);

  // Allow retry if CMS returned an error
  if (rerenderResponse.value && !rerenderResponse.value.success) {
    canRetry.value = true;
  }
};
</script>

<style scoped>
/* You can add any custom styling here */
</style>
