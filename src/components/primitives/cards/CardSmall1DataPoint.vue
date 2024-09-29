<!-- src/components/common/cards/StatCard.vue -->
<template>
  <v-card
    class="pa-1 elevation-0 bg-surface-lighten1 rounded-md"
    :subtitle="subtitle"
  >
    <template v-slot:append>
      <v-icon color="accent" :icon="icon"></v-icon>
    </template>

    <v-card class="mx-auto bg-surface" variant="flat">
      <template v-slot:title>
        <span class="font-weight" :style="{ fontSize: fontSize }">{{
          formattedValue
        }}</span>
      </template>
      <template v-slot:append> <slot name="chart" /> </template>
      <v-card-actions class="justify-end" v-if="buttonText.length > 0">
        <SecondaryButton @click="handleClick">{{ buttonText }}</SecondaryButton>
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script setup>
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import { computed, defineEmits, defineProps } from "vue";

const props = defineProps({
  icon: {
    type: String,
    default: "mdi-home",
  },
  value: {
    type: [Number, String],
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: "View",
  },
  fontSize: {
    type: String,
    default: "36px",
  },
  theme: {
    type: String,
    default: "bg-success-darken1",
  },
});

const emit = defineEmits(["click"]);

const handleClick = (event) => {
  emit("click", event);
};

const formattedValue = computed(() => {
  return typeof props.value === "number" ? `${props.value}` : props.value;
});
</script>

<style scoped>
.font-weight {
  font-weight: 400;
  line-height: 1em;
}

.font-size {
  font-size: var(--fontSize);
  /* Adjust the font size as needed */
}

.v-card-actions {
  justify-content: flex-end;
  /* Align the button to the right */
}
</style>
