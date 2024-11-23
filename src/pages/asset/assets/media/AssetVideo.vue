<template>
  <MediaLayout>
    <!-- Header Slot -->
    <template v-slot:header>
      <CategoryHeader title="VIDEO" icon="mdi-video" />
      <v-spacer></v-spacer>
      <SecondaryButton
        color="accent"
        label="Download"
        @click="downloadVideo(videoUrl)"
        :loading="isDownloading || isPolling"
        :disabled="isDownloading"
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
          :disabled="!canRetry || isRerendering"
          size="small"
        />
      </div>
    </template>

    <!-- Video Body -->
    <template v-slot:body>
      <template v-if="isPolling">
        <!-- Polling State -->
        <v-skeleton-loader color="surface" type="card" />
      </template>

      <template v-else>
        <video controls :src="videoUrl" width="100%" />
      </template>
    </template>
  </MediaLayout>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { useVideoDownload } from "../../composables/useVideoDownload";
import CategoryHeader from "@/components/primitives/headers/CategoryHeader.vue";
import MediaLayout from "@/components/containers/media/mediaLayout.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import { useAssetRerender } from "@/pages/asset/assets/errors/composables/useRerender";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";

// Define component props
const props = defineProps({
  videoUrls: {
    type: Array,
    required: true,
    default: () => [],
  },
  asset: {
    type: Object,
    required: true,
  },
});

// Since we only expect one video URL, extract it directly
const videoUrl = ref(props.videoUrls);
// Destructure the video download composable
const { isDownloading, downloadVideo } = useVideoDownload();
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
