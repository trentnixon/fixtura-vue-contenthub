<template>
  <v-tooltip v-if="tooltip" :text="tooltip" location="top">
    <template v-slot:activator="{ props }">
      <v-btn
        icon
        :color="color"
        :disabled="disabled"
        :loading="loading"
        @click="handleClick"
        class="icon-button"
        :variant="variant"
        :size="size"
        v-bind="props"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
  </v-tooltip>

  <v-btn
    v-else
    icon
    :color="color"
    :disabled="disabled"
    :loading="loading"
    @click="handleClick"
    class="icon-button"
    :variant="variant"
    :size="size"
  >
    <v-icon>{{ icon }}</v-icon>
  </v-btn>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useGA } from "@/utils/useGA";

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "small",
  },
  tooltip: {
    type: String,
    default: null,
  },
  variant: {
    type: String,
    default: "tonal",
  },
});

const emit = defineEmits(["click"]);
const { trackEvent } = useGA(); // Use the GA composable

function handleClick() {
  if (!props.disabled) {
    // Track the button click event
    trackEvent("icon_button_click", "interaction", props.icon);

    // Emit the click event
    emit("click");
  }
}
</script>
