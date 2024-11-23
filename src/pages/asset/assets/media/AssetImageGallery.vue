<template>
  <MediaLayout>
    <!-- Named slot for the header -->
    <template v-slot:header>
      <CategoryHeader title="IMAGES" icon="mdi-image" />
      <v-spacer></v-spacer>
      <SecondaryButton
        color="accent"
        :label="
          isBulkDownloading
            ? 'Downloading...'
            : `Download All (${imageUrls.length})`
        "
        @click="handleBulkDownload(imageUrls)"
        :loading="isBulkDownloading || isPolling"
        size="small"
      />
      <div v-if="asset.editTrigger" class="ml-2">
        <!-- Retry Button -->
        <PrimaryButton
          v-if="canRetry"
          color="success"
          label="Apply Edits"
          @click="handleRerender"
          :loading="isRerendering"
          size="small"
          :disabled="!canRetry || isRerendering"
        />
      </div>
    </template>

    <!-- Conditionally rendering named slots -->
    <template v-slot:loading v-if="!imageUrls.length">
      <p>Loading articles...</p>
    </template>

    <template v-slot:body v-else-if="imageUrls.length">
      <template v-if="isPolling">
        <!-- Polling State -->
        <v-skeleton-loader color="surface" type="card" />
      </template>
      <template v-else>
        <v-row>
          <v-col
            v-for="url in imageUrls"
            :key="url"
            class="d-flex child-flex"
            :cols="isSingleImage ? 12 : 6"
            :sm="isSingleImage ? 12 : 4"
            :md="isSingleImage ? 12 : 3"
          >
            <AssetCard
              :image="url"
              title="Image Asset"
              subtitle="Downloadable"
              description="Click the button to download or view the image"
              @download="downloadImage(url)"
              @view="viewImage(url)"
            />
          </v-col>
        </v-row>
      </template>
      <!-- Vuetify Modal for viewing image -->
      <v-dialog
        v-model="isModalOpen"
        :max-width="dialogMaxWidth"
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-img
            :src="currentImage"
            :aspect-ratio="4 / 5"
            class="bg-grey-lighten-2"
            cover
          >
            <v-container class="d-flex justify-end">
              <IconButton
                size="x-small"
                color="success"
                icon="mdi-download"
                class="mr-1"
                variant="elevated"
                @click="downloadImage(currentImage)"
              />
              <IconButton
                size="x-small"
                color="error"
                icon="mdi-close"
                variant="elevated"
                @click="isModalOpen = false"
              /> </v-container
          ></v-img>
        </v-card>
      </v-dialog>
    </template>

    <template v-slot:noContent v-else>
      <p>No images available</p>
    </template>
  </MediaLayout>
</template>

<script setup>
import { computed, defineProps, ref } from "vue";
import { useDisplay } from "vuetify";
import { useImageDownloads } from "../../composables/useImageDownloads.js";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import AssetCard from "@/components/primitives/cards/AssetCard.vue";
import CategoryHeader from "@/components/primitives/headers/CategoryHeader.vue";
import MediaLayout from "@/components/containers/media/mediaLayout.vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import { useAssetRerender } from "@/pages/asset/assets/errors/composables/useRerender";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";

const props = defineProps({
  imageUrls: {
    type: Array,
    required: true,
  },
  isSingleImage: {
    type: Boolean,
    default: false,
  },
  asset: {
    type: Object,
    required: true,
  },
});

// Using Vuetify's useDisplay composable
const { height, width } = useDisplay();

// Compute max-width and max-height based on screen size and aspect ratio
const dialogMaxWidth = computed(() => {
  const maxHeight = height.value * 0.9; // 90% of screen height
  const maxWidth = (maxHeight / 5) * 4; // maintain 4:5 aspect ratio
  return Math.min(maxWidth, width.value * 0.9) + "px"; // Ensure it's not wider than 90% of screen width
});

// Using the composable
const {
  isModalOpen,
  currentImage,
  isBulkDownloading,
  downloadImage,
  handleBulkDownload,
  viewImage,
} = useImageDownloads();

// State for whether the user can retry
const canRetry = ref(true);

// Composable handling rerender logic
const { triggerRerender, isRerendering, rerenderResponse, isPolling } =
  useAssetRerender();

const handleRerender = async () => {
  canRetry.value = false; // Disable retry button
  await triggerRerender(props.asset);

  // Allow retry if CMS returned an error
  if (rerenderResponse && !rerenderResponse.success) {
    canRetry.value = true;
  }
};
</script>
