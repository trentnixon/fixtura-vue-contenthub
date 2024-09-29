<template>
  <MediaLayout>
    <!-- Header Slot -->
    <template v-slot:header>
      <CategoryHeader title="VIDEO" icon="mdi-video" />
      <v-spacer></v-spacer>
      <SecondaryButton
        color="accent"
        label="Download Video"
        @click="downloadVideo(selectedVideo.url)"
        :loading="isDownloading"
        :disabled="!selectedVideo || isDownloading"
      />
    </template>

    <!-- Conditionally rendering named slots -->
    <!-- Loading State -->
    <template v-slot:loading v-if="isLoading">
      <p>Loading video...</p>
    </template>

    <!-- Render Error State -->
    <template v-slot:renderError v-else-if="hasRenderError">
      <v-alert
        type="error"
        title="Rendering Error"
        icon="mdi-alert-circle"
        elevation="2"
        colored-border
        class="d-flex flex-column align-start"
      >
        <div class="text-body">
          There was an error rendering the video. We are aware of this issue and
          are working on a fix.
        </div>
        <!-- <SecondaryButton
          color="primary"
          label="Retry Rerender"
          @click="retryRerender"
        /> -->
      </v-alert>
    </template>

    <!-- Video Body -->
    <template v-slot:body v-else-if="selectedVideo">
      <video controls :src="selectedVideo.url" width="100%" />
      <p v-if="downloadError" class="error-message">{{ downloadError }}</p>
    </template>

    <!-- No Content State -->
    <template v-slot:noContent v-else>
      <p>No video available</p>
    </template>
  </MediaLayout>
</template>

<script setup>
import { ref, computed, watch, defineProps } from "vue";
import { useVideoDownload } from "../../composables/useVideoDownload";
import CategoryHeader from "@/components/primitives/headers/CategoryHeader.vue";
import MediaLayout from "@/components/containers/media/mediaLayout.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";

// Define component props
const props = defineProps({
  videoUrls: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// Destructure the video download composable
const { isDownloading, downloadVideo, downloadError } = useVideoDownload();

// Initialize selected video URL
const selectedVideoUrl = ref(props.videoUrls[0]?.url || null);

// Compute the selected video object
const selectedVideo = computed(() => {
  return props.videoUrls.find((video) => video.url === selectedVideoUrl.value);
});

// Determine if the component is in a loading state
const isLoading = ref(props.videoUrls.length === 0);

// Watch for changes in the videoUrls prop to update selected video and loading state
watch(
  () => props.videoUrls,
  (newUrls) => {
    if (newUrls.length > 0) {
      selectedVideoUrl.value = newUrls[0].url;
      isLoading.value = false;
    } else {
      selectedVideoUrl.value = null;
      isLoading.value = true;
    }
  },
  { immediate: true }
);

// Computed property to check for render errors
const hasRenderError = computed(() => {
  return selectedVideo.value?.hasBeenProcessed && selectedVideo.value.hasError;
});

// Method to handle retrying the render
function retryRerender() {
  console.log("rerendering file");
}
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  background-color: #ffe6e6;
  border: 1px solid red;
  border-radius: 4px;
}

.error-container p {
  margin-bottom: 10px;
}
</style>
