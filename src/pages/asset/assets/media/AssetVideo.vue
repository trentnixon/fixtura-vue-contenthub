<template>
  <MediaLayout>
    <!-- Header Slot -->
    <template v-slot:header>
      <CategoryHeader title="VIDEO" icon="mdi-video" />
      <v-spacer></v-spacer>
      <SecondaryButton
        color="accent"
        label="Download"
        @click="handleDownload"
        :loading="isDownloading || isPolling"
        :disabled="isDownloading"
        size="small"
      />

      <div v-if="asset.editTrigger" class="ml-2">
        <!-- Retry Button -->
        <PrimaryButton
          color="success"
          label="Apply Edits"
          @click="handleRerender"
          :loading="isPolling"
          :disabled="isPolling"
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
import { computed, ref } from "vue";
import { useVideoDownload } from "../../composables/useVideoDownload";
import { useAssetDownloadAnalytics } from "../../composables/useAssetDownloadAnalytics";
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

const mediaVersion = ref(0);

const videoUrl = computed(() => {
  const source = props.videoUrls;
  if (!mediaVersion.value || typeof source !== "string") return source;
  const joiner = source.includes("?") ? "&" : "?";
  return `${source}${joiner}v=${mediaVersion.value}`;
});
const { isDownloading, downloadVideo } = useVideoDownload();
const { buildDownloadContext } = useAssetDownloadAnalytics();

async function handleDownload() {
  const context = buildDownloadContext(props.asset, "video");
  await downloadVideo(videoUrl.value, context);
}
// Composable handling rerender logic. isPolling belongs to this video only.
const { triggerRerender, isPolling } = useAssetRerender();

const handleRerender = async () => {
  const finished = await triggerRerender(props.asset);
  if (finished) mediaVersion.value += 1;
};
</script>
