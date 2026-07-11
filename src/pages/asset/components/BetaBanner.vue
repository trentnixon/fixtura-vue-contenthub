<template>
  <v-row v-if="show">
    <v-col cols="12">
      <v-alert :color="color" variant="tonal" class="mb-4" prominent>
        <template v-slot:prepend>
          <v-icon>{{ icon }}</v-icon>
        </template>
        <div>
          <div class="font-weight-bold mb-1">{{ title }}</div>
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="text-body-2"
          >
            {{ message }}
          </div>
          <slot name="actions"></slot>
        </div>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "Beta Testing",
  },
  messages: {
    type: Array,
    default: () => [
      "Our Team of the Week is currently in testing, and we would love some feedback.",
      "If you have any issues or would like a change to the Team of the Week, please let us know.",
    ],
  },
  color: {
    type: String,
    default: "accent",
  },
  icon: {
    type: String,
    default: "mdi-flask",
  },
});
</script>
