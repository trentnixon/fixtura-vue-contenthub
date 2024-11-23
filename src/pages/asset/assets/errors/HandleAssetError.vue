<template>
  <MediaLayout>
    <!-- Header Slot -->
    <template v-slot:header>
      <CategoryHeader title="VIDEO" icon="mdi-video-off" />
      <v-spacer />

      <!-- Retry Button -->
      <SecondaryButton
        v-if="canRetry"
        color="error"
        label="Retry Render"
        @click="handleRerender"
        :loading="isRerendering"
        :disabled="!canRetry || isRerendering"
      />

      <!-- Polling Indicator -->
      <CustomChip
        v-if="isPolling"
        label="Processing Asset"
        :value="isPolling"
        type="boolean"
        size="small"
      />
    </template>

    <!-- Video Body -->
    <template v-slot:body>
      <template v-if="isPolling">
        <!-- Polling State -->
        <v-skeleton-loader color="surface" type="card" />
      </template>

      <template v-else-if="isRerendering">
        <!-- Rerendering State -->
        <ProcessingState />
      </template>

      <template v-else>
        <!-- Video Failed State -->
        <div v-if="!rerenderResponse && !rerenderError">
          <div class="d-flex justify-start align-center pa-4">
            <v-icon color="error" class="mr-4">mdi-video-off</v-icon>
            <div class="text-body">
              Asset failed to render for {{ asset.name }}.
            </div>
          </div>
        </div>

        <!-- Success State -->
        <SuccessMessage v-if="rerenderResponse && rerenderResponse.success" />

        <!-- CMS Error State -->
        <ErrorMessage
          v-if="rerenderResponse && !rerenderResponse.success"
          :errorMessage="rerenderResponse.error"
        />

        <!-- Local Error State -->
        <LocalErrorMessage v-if="rerenderError" :errorMessage="rerenderError" />
      </template>
    </template>
  </MediaLayout>
</template>

<script setup>
import { ref } from "vue";
import { defineProps } from "vue";
import MediaLayout from "@/components/containers/media/mediaLayout.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import ProcessingState from "./components/ProcessingState.vue";
import SuccessMessage from "./components/SuccessMessage.vue";
import ErrorMessage from "./components/ErrorMessage.vue";
import LocalErrorMessage from "./components/LocalErrorMessage.vue";
import CustomChip from "@/components/primitives/chips/CustomChip.vue";
import { useAssetRerender } from "./composables/useRerender.ts";

// Define props for the asset
const props = defineProps({
  asset: {
    type: Object,
    required: true,
  },
});

// State for whether the user can retry
const canRetry = ref(true);

// Composable handling rerender logic
const {
  triggerRerender,
  isRerendering,
  rerenderError,
  rerenderResponse,
  isPolling,
} = useAssetRerender();

// Function to handle the rerender logic
const handleRerender = async () => {
  canRetry.value = false; // Disable retry button
  await triggerRerender(props.asset);

  // Allow retry if CMS returned an error
  if (rerenderResponse && !rerenderResponse.success) {
    canRetry.value = true;
  }
};
</script>
