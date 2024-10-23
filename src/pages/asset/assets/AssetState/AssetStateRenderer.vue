<template>
  <!-- Asset rendering based on the state -->
  <template v-if="state === 'initialError'">
    <HandleAssetError :asset="asset" />
  </template>
  <template v-if="state === 'unprocessed'">
    <HandleAssetError :asset="asset" />
  </template>
  <template v-else-if="state === 'processed' && asset?.downloads.length > 0">
    <AssetVideo v-if="isVideo" :videoUrls="asset.downloads[0]" />
    <AssetImageGallery v-else :imageUrls="asset.downloads" />
  </template>
  <template v-else-if="state === 'rerendering'">
    <PollingAssetState :asset="asset" />
  </template>
  <template v-else-if="state === 'rerenderFailed'">
    <AssetRerenderFailedState />
  </template>
  <template v-else-if="state === 'unknown'">
    <UnknownErrorState />
  </template>
</template>

<script setup>
import { computed, defineProps } from "vue";
import HandleAssetError from "../errors/HandleAssetError.vue";
import AssetVideo from "../media/AssetVideo.vue";
import AssetImageGallery from "../media/AssetImageGallery.vue";
import PollingAssetState from "../errors/PollingAssetState.vue";
import AssetRerenderFailedState from "../errors/AssetRerenderFailedState.vue";
import UnknownErrorState from "../errors/UnknownErrorState.vue";

const props = defineProps({
  asset: Object,
  state: String,
});

console.group("[Renderer]", props.asset, props.state);
// Determine if the asset is a video or image
const isVideo = computed(() => props.asset?.category === "VIDEO");
</script>
