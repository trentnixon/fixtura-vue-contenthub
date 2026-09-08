<template>
  <v-dialog v-model="isVisible" max-width="520px" :persistent="persistent">
    <v-card class="pressbox-confirm">
      <v-card-text class="pa-6 pb-4">
        <div
          class="pressbox-confirm__layout d-flex flex-column flex-sm-row align-center align-sm-start"
        >
          <v-avatar
            :color="iconColor"
            variant="tonal"
            size="72"
            class="pressbox-confirm__icon flex-shrink-0"
          >
            <v-icon :color="iconColor" size="36">
              {{ PRESSBOX_COPY.panel.icon }}
            </v-icon>
          </v-avatar>

          <div
            class="pressbox-confirm__content flex-grow-1 text-center text-sm-start"
          >
            <p class="text-h6 font-weight-bold mb-2">{{ title }}</p>
            <p class="text-body-2 text-medium-emphasis mb-2">{{ subhead }}</p>
            <p class="article-body mb-0">{{ description }}</p>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4 pt-2">
        <v-spacer />
        <SecondaryButton
          :label="cancelLabel"
          :disabled="loading || disabled"
          @click="close"
        />
        <PrimaryButton
          :label="confirmLabel || title"
          :loading="loading"
          :disabled="loading || disabled"
          @click="confirm"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    subhead: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    iconColor?: string;
    persistent?: boolean;
    loading?: boolean;
    disabled?: boolean;
  }>(),
  {
    cancelLabel: "Cancel",
    iconColor: "accent",
    persistent: false,
    loading: false,
    disabled: false,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
}>();

const isVisible = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    isVisible.value = value;
  }
);

watch(isVisible, (value) => {
  emit("update:modelValue", value);
});

function close(): void {
  if (!props.loading && !props.disabled) {
    isVisible.value = false;
  }
}

function confirm(): void {
  if (!props.loading && !props.disabled) {
    emit("confirm");
    close();
  }
}
</script>

<style scoped>
.pressbox-confirm__layout {
  gap: 20px;
}

@media (min-width: 600px) {
  .pressbox-confirm__layout {
    gap: 24px;
  }

  .pressbox-confirm__icon {
    margin-top: 2px;
  }
}
</style>
