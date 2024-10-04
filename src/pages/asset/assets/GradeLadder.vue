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

      <template #video>
        <template v-if="videoHasError">
          <VideoAssetError :asset="videoAsset" />
        </template>
        <AssetVideo
          v-else-if="videoAssets.length > 0"
          :videoUrls="videoAssets[0]"
        />
      </template>

      <template #gallery>
        <template v-if="galleryHasError">
          <ImageAssetError :asset="imageAsset" />
        </template>
        <AssetImageGallery
          v-else-if="imageAssets.length > 0"
          :imageUrls="imageAssets"
        />
      </template>
    </AssetTabs>

    <!-- Layout for non-xs screens -->
    <v-row v-else>
      <!-- Video Column -->
      <v-col cols="12" sm="5" class="px-1">
        <template v-if="videoHasError">
          <VideoAssetError :asset="videoAsset" />
        </template>
        <AssetVideo
          v-else-if="videoAssets.length > 0"
          :videoUrls="videoAssets[0]"
        />
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
        <template v-if="galleryHasError">
          <ImageAssetError :asset="imageAsset" />
        </template>
        <AssetImageGallery
          v-else-if="imageAssets.length > 0"
          :imageUrls="imageAssets"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import AssetVideo from "./media/AssetVideo.vue";
import AssetImageGallery from "./media/AssetImageGallery.vue";
import AssetDisplayArticle from "./media/AssetDisplayArticle.vue";
import { defineProps, computed } from "vue";
import AssetTabs from "@/pages/asset/components/AssetTabs.vue";
import VideoAssetError from "./errors/VideoAssetError.vue";
import ImageAssetError from "./errors/ImageAssetError.vue";
// import AIArticleError from "./errors/AIArticleError.vue";

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
const videoAsset = computed(() => {
  return props.formattedAssets.find((asset) => asset.category === "VIDEO");
});
const videoAssets = computed(() => {
  return videoAsset.value ? videoAsset.value.downloads || [] : [];
});
const videoHasError = computed(() => videoAsset.value?.hasError || false);

// Extract image assets and detect errors
const imageAsset = computed(() => {
  return props.formattedAssets.find((asset) => asset.category === "IMAGE");
});
const imageAssets = computed(() => {
  return imageAsset.value ? imageAsset.value.downloads || [] : [];
});
const galleryHasError = computed(() => imageAsset.value?.hasError || false);

// Setup asset tabs for switching views
const assetTabs = computed(() => [
  {
    value: "video",
    label: "Video",
    condition: videoAssets.value.length > 0,
  },
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
