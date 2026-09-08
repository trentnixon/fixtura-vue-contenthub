<template>
  <div class="text-center pa-8">
    <template v-if="!isTimedOut">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        class="mb-6"
      />
      <p class="text-h6 font-weight-bold mb-2">
        {{ PRESSBOX_COPY.status.generatingTitle }}
      </p>
      <p v-if="statusSubtitle" class="text-body-2 text-medium-emphasis mb-3">
        {{ statusSubtitle }}
      </p>
      <p class="article-body mb-3">{{ bodyText }}</p>
      <p class="text-caption text-grey">
        {{ PRESSBOX_COPY.status.generatingLeaveHint }}
      </p>
    </template>

    <template v-else>
      <v-icon color="warning" size="64" class="mb-6">
        mdi-clock-outline
      </v-icon>
      <p class="text-h6 font-weight-bold mb-3">
        {{ PRESSBOX_COPY.status.timeoutTitle }}
      </p>
      <p class="article-body mb-3">{{ PRESSBOX_COPY.status.timeoutBody }}</p>
      <p class="text-caption text-grey mb-6">
        {{ PRESSBOX_COPY.status.timeoutLeaveHint }}
      </p>
      <div class="d-flex flex-wrap justify-center" style="gap: 12px">
        <PrimaryButton
          :label="PRESSBOX_COPY.status.checkForUpdate"
          :loading="isChecking"
          :disabled="isChecking"
          @click="$emit('check-status')"
        />
        <SecondaryButton
          :label="PRESSBOX_COPY.status.keepWaiting"
          :disabled="isChecking"
          @click="$emit('keep-waiting')"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";

const props = defineProps<{
  articleStatus: string;
  bodyText: string;
  isTimedOut?: boolean;
  isChecking?: boolean;
}>();

defineEmits<{
  "check-status": [];
  "keep-waiting": [];
}>();

const statusSubtitle = computed(() => {
  if (props.articleStatus === "writing") {
    return PRESSBOX_COPY.status.generatingSubtitleWriting;
  }
  if (props.articleStatus === "pending") {
    return PRESSBOX_COPY.status.generatingSubtitleQueued;
  }
  return "";
});
</script>
