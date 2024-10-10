<template>
  <v-container class="pa-0" fluid>
    <!-- Tabs for xs screens -->
    <AssetTabs v-if="$vuetify.display.xs" :tabs="assetTabs">
      <template #articles>
        <AssetDisplayArticle
          v-if="formattedArticles.length > 0"
          :articles="formattedArticles"
        />
      </template>

      <!-- Render video state for mobile -->
      <template #video>
        <AssetStateRenderer :asset="videoAsset" :state="videoState" />
      </template>

      <!-- Render gallery state for mobile -->
      <template #gallery>
        <AssetStateRenderer :asset="imageAsset" :state="galleryState" />
      </template>
    </AssetTabs>

    <!-- Layout for non-xs screens -->
    <v-row v-else>
      <!-- Video Column -->
      <v-col cols="12" sm="5" class="px-1">
        <AssetStateRenderer :asset="videoAsset" :state="videoState" />
      </v-col>

      <!-- Article Column -->
      <v-col class="d-flex justify-start px-1" cols="12" sm="7">
        <AssetDisplayArticle
          v-if="formattedArticles.length > 0"
          :articles="formattedArticles"
        />
      </v-col>

      <!-- Image Gallery Column -->
      <v-col cols="12">
        <AssetStateRenderer :asset="imageAsset" :state="galleryState" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { defineProps, computed } from "vue";
import AssetDisplayArticle from "./media/AssetDisplayArticle.vue";
import AssetTabs from "@/pages/asset/components/AssetTabs.vue";
import { useAssetState } from "../composables/useAssetState";
import AssetStateRenderer from "./AssetState/AssetStateRenderer.vue";

const props = defineProps({
  formattedAssets: {
    type: Array,
    required: true,
  },
  formattedArticles: {
    type: Array,
    required: true,
  },
});

// Extract video assets and detect errors
const videoAsset = computed(() =>
  props.formattedAssets.find((asset) => asset.category === "VIDEO")
);
const videoAssets = computed(() =>
  videoAsset.value ? videoAsset.value.downloads || [] : []
);

// Extract image assets and detect errors
const imageAsset = computed(() =>
  props.formattedAssets.find((asset) => asset.category === "IMAGE")
);
const imageAssets = computed(() =>
  imageAsset.value ? imageAsset.value.downloads || [] : []
);

// Use the composable to compute the states for video and gallery assets
const { assetState: videoState } = useAssetState(videoAsset.value);
const { assetState: galleryState } = useAssetState(imageAsset.value);

// Setup asset tabs for switching views
const assetTabs = computed(() => [
  { value: "video", label: "Video", condition: videoAssets.value.length > 0 },
  {
    value: "gallery",
    label: "Gallery",
    condition: imageAssets.value.length > 0,
  },
  {
    value: "articles",
    label: "Articles",
    condition: props.formattedArticles.length > 0,
  },
]);
</script>
