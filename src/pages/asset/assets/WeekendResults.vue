<template>
  <v-container class="pa-0" fluid>
    <!-- Tabs for xs screens -->
    <AssetTabs v-if="$vuetify.display.xs" :tabs="assetTabs">
      <template #articles>
        <!-- Display the articles when available -->
        <AssetDisplayArticle
          v-if="formattedArticles.length > 0"
          :articles="formattedArticles"
        />
      </template>
      <template #video>
        <AssetVideo v-if="videoAssets.length > 0" :videoUrls="videoAssets[0]" />
      </template>
      <template #gallery>
        <AssetImageGallery
          v-if="imageAssets.length > 0"
          :imageUrls="imageAssets"
        />
      </template>
    </AssetTabs>

    <!-- Layout for non-xs screens -->
    <v-row v-else>
      <!-- Video Column -->
      <v-col cols="12" sm="5" class="px-1">
        <AssetVideo v-if="videoAssets.length > 0" :videoUrls="videoAssets[0]" />
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
        <AssetImageGallery
          v-if="imageAssets.length > 0"
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

// Props
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

// Extract video assets from formatted assets
const videoAssets = computed(() => {
  return props.formattedAssets
    .filter((asset) => asset.category === "VIDEO")
    .flatMap((asset) => asset.downloads.map((download) => download)); // Map all video URLs
});

// Extract image assets from formatted assets
const imageAssets = computed(() => {
  return props.formattedAssets
    .filter((asset) => asset.category === "IMAGE")
    .flatMap((asset) => asset.downloads.map((download) => download)); // Map all image URLs
});

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
