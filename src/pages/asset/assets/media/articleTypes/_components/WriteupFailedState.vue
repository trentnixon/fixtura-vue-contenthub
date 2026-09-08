<template>
  <div class="text-center pa-8">
    <v-icon color="error" size="64" class="mb-6">mdi-alert-circle</v-icon>
    <p class="text-h6 font-weight-bold mb-3 text-error">
      {{ PRESSBOX_COPY.status.failedTitle }}
    </p>
    <p class="article-body mb-3">
      {{
        isLocked
          ? PRESSBOX_COPY.status.failedLockedBody
          : PRESSBOX_COPY.status.failedBody
      }}
    </p>
    <p v-if="detailMessage" class="text-body-2 text-error mb-3">
      {{ detailMessage }}
    </p>
    <p class="text-caption text-grey mb-4">
      {{
        isLocked
          ? PRESSBOX_COPY.status.failedLockedHint
          : PRESSBOX_COPY.status.failedRetryHint
      }}
    </p>
    <PrimaryButton
      v-if="!isLocked"
      :label="PRESSBOX_COPY.status.retryGeneration"
      :loading="isRequesting"
      :disabled="isRequesting"
      @click="$emit('retry')"
    />
  </div>
</template>

<script setup lang="ts">
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";

defineProps<{
  isLocked?: boolean;
  isRequesting?: boolean;
  detailMessage?: string;
}>();

defineEmits<{
  retry: [];
}>();
</script>
