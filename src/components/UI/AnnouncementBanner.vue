<template>
  <v-alert v-if="enabled && show" type="error" variant="tonal" class="mx-4 mt-4 announcement-banner" prominent
    dismissible @click:close="dismiss">
    <div>
      <div v-if="title" class="font-weight-medium banner-text mb-1">{{ title }}</div>
      <div v-if="message" class="text-caption banner-text">{{ message }}</div>
    </div>
  </v-alert>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  enabled: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
});

const show = ref(true);

// Check localStorage to see if banner was dismissed
const storageKey = 'announcement-banner-dismissed';

onMounted(() => {
  const dismissed = localStorage.getItem(storageKey);
  if (dismissed === 'true') {
    show.value = false;
  }
});

function dismiss() {
  show.value = false;
  localStorage.setItem(storageKey, 'true');
}
</script>

<style scoped>
.banner-text {
  color: #424242 !important;
  /* Dark gray */
}

.announcement-banner :deep(.v-alert__content) {
  color: #424242 !important;
}
</style>
