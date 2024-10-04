<template>
  <MediaLayout>
    <!-- Header Slot -->
    <template v-slot:header>
      <CategoryHeader title="VIDEO" icon="mdi-video-off" />
      <v-spacer></v-spacer>
      <SecondaryButton
        color="error"
        label="Retry Render"
        @click="handleRerender"
        :loading="isDownloading"
        :disabled="isDownloading || !canRetry"
      />
    </template>

    <!-- Video Body -->
    <template v-slot:body>
      <div class="d-flex justify-start align-center pa-4">
        <v-icon color="error" class="mr-4">mdi-video-off</v-icon>
        <div class="text-body">
          <template v-if="isDownloading">
            <v-progress-linear
              indeterminate
              color="primary"
            ></v-progress-linear>
            <p>Rerender in progress. Please wait...</p>
          </template>
          <template v-else-if="canRetry">
            <p>
              Video failed to render for {{ asset.name }}. Click retry to
              attempt again.
            </p>
          </template>
          <template v-else>
            <p>
              Video failed to render after a retry. No further attempts allowed.
            </p>
          </template>
        </div>
      </div>
    </template>
  </MediaLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MediaLayout from "@/components/containers/media/mediaLayout.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import CategoryHeader from "@/components/primitives/headers/CategoryHeader.vue";
import {
  triggerRerenderAPI,
  pollRerenderStatus,
} from "./composables/useRerender"; // Composable functions to trigger and poll

// eslint-disable-next-line
const props = defineProps({
  asset: {
    type: Object,
    required: true,
  },
});

const isDownloading = ref(false);
const canRetry = ref(true); // Determine whether the user can retry the render

// Check if the asset has been previously rerendered
onMounted(() => {
  if (props.asset.forceRerender && props.asset.hasBeenProcessed) {
    // If rerender was tried and processed, check the error flag
    canRetry.value = !props.asset.hasError;
  }
});

// Function to handle rerender logic
const handleRerender = async () => {
  isDownloading.value = true;
  try {
    // Trigger the rerender API call
    await triggerRerenderAPI(props.asset);

    // Start polling for status updates
    pollRerender();
  } catch (error) {
    console.error("Rerender trigger failed:", error);
    isDownloading.value = false;
  }
};

// Polling function to check the rerender status
const pollRerender = async () => {
  const pollInterval = 5000; // Poll every 5 seconds
  const maxAttempts = 20; // Limit the number of attempts
  let attempts = 0;

  const poll = async () => {
    try {
      const updatedStatus = await pollRerenderStatus(props.asset);
      attempts += 1;

      if (updatedStatus.hasBeenProcessed) {
        isDownloading.value = false;
        if (updatedStatus.hasError) {
          canRetry.value = false;
        }
      } else if (attempts < maxAttempts) {
        setTimeout(poll, pollInterval); // Poll again after the interval
      } else {
        isDownloading.value = false;
        console.error("Rerender polling exceeded max attempts.");
      }
    } catch (error) {
      isDownloading.value = false;
      console.error("Polling error:", error);
    }
  };

  poll(); // Start polling
};
</script>
