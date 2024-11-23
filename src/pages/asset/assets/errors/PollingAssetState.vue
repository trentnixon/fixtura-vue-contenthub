<template>
  <MediaLayout>
    <!-- Header Slot -->
    <template v-slot:header>
      <CategoryHeader title="VIDEO" icon="mdi-video-off" />
      <v-spacer />
      <!-- Polling Indicator -->
      <CustomChip
        label="Processing Asset"
        :value="isPolling"
        type="boolean"
        size="small"
      />
    </template>

    <!-- Video Body -->
    <template v-slot:body>
      <v-skeleton-loader color="surface" type="card" />
    </template>
  </MediaLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { defineProps } from "vue";
import MediaLayout from "@/components/containers/media/mediaLayout.vue";
import CustomChip from "@/components/primitives/chips/CustomChip.vue";
import { useAssetRerender } from "./composables/useRerender.ts";

// Define props for the asset
const props = defineProps({
  asset: {
    type: Object,
    required: true,
  },
});

// Composable handling rerender logic
const { oneTimePollDownloadStatus, isPolling } = useAssetRerender();

// Run the one-time poll when the component is mounted (after page refresh or navigation)
onMounted(() => {
  oneTimePollDownloadStatus(props.asset.id);
});
</script>
