<template>
  <div class="writeup-empty-state pa-6 pa-md-8">
    <div
      class="writeup-empty-state__layout d-flex flex-column flex-sm-row align-center align-sm-start"
    >
      <v-avatar
        :color="iconColor"
        variant="tonal"
        size="88"
        class="writeup-empty-state__icon flex-shrink-0"
      >
        <v-icon :color="iconColor" size="44">
          {{ PRESSBOX_COPY.panel.icon }}
        </v-icon>
      </v-avatar>

      <div
        class="writeup-empty-state__content flex-grow-1 text-center text-sm-start"
      >
        <p class="text-h6 font-weight-bold mb-2">{{ headline }}</p>
        <p v-if="subhead" class="text-body-2 text-medium-emphasis mb-2">
          {{ subhead }}
        </p>
        <p class="article-body mb-0">{{ description }}</p>

        <div
          class="writeup-empty-state__actions d-flex justify-center justify-sm-start mt-5"
        >
          <PrimaryButton
            :label="buttonLabel"
            :loading="isRequesting"
            :disabled="isRequesting || isLocked"
            @click="$emit('request-writeup')"
          />
        </div>
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";

withDefaults(
  defineProps<{
    headline: string;
    description: string;
    subhead?: string;
    iconColor?: string;
    buttonLabel?: string;
    isRequesting?: boolean;
    isLocked?: boolean;
  }>(),
  {
    iconColor: "accent",
    buttonLabel: PRESSBOX_COPY.cta.generateWriteup,
  }
);

defineEmits<{
  "request-writeup": [];
}>();
</script>

<style scoped>
.writeup-empty-state__layout {
  gap: 20px;
}

@media (min-width: 600px) {
  .writeup-empty-state__layout {
    gap: 28px;
  }

  .writeup-empty-state__icon {
    margin-top: 4px;
  }
}
</style>
