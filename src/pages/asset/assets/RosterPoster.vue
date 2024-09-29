<template>
    <v-row>
        <v-col cols="12">
            <AssetImageGallery v-if="imageAssets.length > 0" :imageUrls="imageAssets[0]" />
        </v-col>
    </v-row>
</template>

<script setup>
import AssetImageGallery from './media/AssetImageGallery.vue';
import { defineProps, computed } from 'vue';

const props = defineProps({
    formattedAssets: {
        type: Array,
        required: true
    },
    aiArticles: {
        type: Array,
        required: true
    }
});

// Extract image assets from formatted assets
const imageAssets = computed(() => {
    return props.formattedAssets.filter(asset => asset.category === 'IMAGE').map(asset => asset.url);
});

</script>
