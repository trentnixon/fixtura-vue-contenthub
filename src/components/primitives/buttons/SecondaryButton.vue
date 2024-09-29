<template>
  <v-btn :color="color" :disabled="disabled" :loading="loading" @click="handleClick" class="secondary-button"
    :prepend-icon="icon" variant="tonal">

    {{ label }}
  </v-btn>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
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
    default: 'secondary',
  },
});

const emit = defineEmits(['click']);

function handleClick() {
  if (!props.disabled) {
    emit('click');
  }
}
</script>

