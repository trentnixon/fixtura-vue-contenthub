<template>
  <div v-if="showWhenEmpty || totalCount > 0" class="mb-4">
    <v-text-field :model-value="searchQuery" @update:model-value="$emit('update:searchQuery', $event)"
      label="Search fixtures" placeholder="Search by team, competition, date..." prepend-inner-icon="mdi-magnify"
      variant="outlined" density="compact" clearable hide-details class="w-100" />
    <div v-if="searchQuery" class="mt-2 text-caption text-grey">
      Showing {{ filteredCount }} of {{ totalCount }} fixtures
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  searchQuery: string;
  filteredCount: number;
  totalCount: number;
  showWhenEmpty?: boolean;
}>();

defineEmits<{
  "update:searchQuery": [value: string];
}>();
</script>
