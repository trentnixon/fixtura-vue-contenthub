<template>
  <MediaLayout>
    <!-- Header Slot -->
    <template v-slot:header>
      <CategoryHeader title="VIDEO" icon="mdi-video" />
      <v-spacer></v-spacer>
      <SecondaryButton
        color="accent"
        label="Download Video"
        @click="downloadVideo(videoUrl)"
        :loading="isDownloading"
        :disabled="isDownloading"
      />
    </template>

    <!-- Video Body -->
    <template v-slot:body>
      <video controls :src="videoUrl" width="100%" />
    </template>
  </MediaLayout>
</template>

<script setup>
import { ref, defineProps } from "vue";
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

// Since we only expect one video URL, extract it directly
const videoUrl = ref(props.videoUrls);
console.log("[videoUrl]", videoUrl.value);

// Destructure the video download composable
const { isDownloading, downloadVideo } = useVideoDownload();
</script>

<style scoped>
/* You can add scoped styles here if needed */
</style>
