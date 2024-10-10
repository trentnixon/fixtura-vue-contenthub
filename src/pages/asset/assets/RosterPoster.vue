<template>
  <v-row>
    <template v-if="!imageAsset"> Error </template>
    <template v-else>
      <AssetStateRenderer :asset="imageAsset" :state="galleryState" />
    </template>
    <v-col cols="12"> </v-col>
  </v-row>
</template>

<script setup>
import { useAssetState } from "@/pages/asset/composables/useAssetState";
import { defineProps, computed } from "vue";
import AssetStateRenderer from "@/pages/asset/assets/AssetState/AssetStateRenderer.vue";

const props = defineProps({
  formattedAssets: {
    type: Array,
    required: true,
  },
  aiArticles: {
    type: Array,
    required: true,
  },
});

// Extract image assets from formatted assets
const imageAsset = computed(() =>
  props.formattedAssets.find((asset) => asset.category === "IMAGE")
);

const { assetState: galleryState } = useAssetState(imageAsset.value);
</script>
