<template>
  <div>
    <!-- Loading state -->
    <div v-if="fixtures.length === 0 && !error" class="text-center pa-8">
      <v-progress-circular indeterminate color="primary" class="mb-4"></v-progress-circular>
      <p class="text-body-2">Loading fixtures...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="fixtures.length === 0" class="text-center pa-8">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-baseball</v-icon>
      <p class="text-h6 mb-2">No Fixtures Found</p>
      <p class="text-body-2 text-grey">No fixture data is available for this article.</p>
    </div>

    <!-- No results from filter -->
    <div v-else-if="filteredAndSortedFixtures.length === 0" class="text-center pa-8">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-magnify</v-icon>
      <p class="text-h6 mb-2">No Fixtures Match Your Search</p>
      <p class="text-body-2 text-grey">Try adjusting your search or filter criteria.</p>
    </div>

    <!-- Fixture List -->
    <div v-else class="fixture-list" :style="{ maxHeight: minHeightStyle, overflowY: 'auto', }">
      <template v-for="(item, index) in filteredAndSortedFixtures" :key="item.originalIndex">
        <div class="mb-1 rounded">
          <v-card class="bg-surface-lighten-1" style="border: none; box-shadow: none;" :class="{
            'bg-blue-lighten-5': unsavedChanges.has(item.originalIndex),
          }">
            <v-card-title
              style="padding: 10px; white-space: normal; word-wrap: break-word; overflow-wrap: break-word; width: 100%;">
              <div style="width: 100%; min-width: 0;">
                <div class="d-flex align-center justify-space-between mb-1">
                  <div class="text-caption text-grey">
                    {{ getFixtureSummary(item.fixture, item.originalIndex, unsavedChanges).ageGroup }} {{
                      getFixtureSummary(item.fixture, item.originalIndex, unsavedChanges).grade }}
                  </div>
                  <IconButton icon="mdi-pencil" tooltip="Edit" size="x-small" color="success"
                    @click="$emit('edit-fixture', item.originalIndex)" />
                </div>
                <div class="text-body-1"
                  style="font-weight: normal; white-space: normal; word-wrap: break-word; overflow-wrap: break-word; hyphens: auto;">
                  {{ getFixtureSummary(item.fixture, item.originalIndex, unsavedChanges).homeTeam }} vs {{
                    getFixtureSummary(item.fixture, item.originalIndex, unsavedChanges).awayTeam }}
                </div>
                <div v-if="unsavedChanges.has(item.originalIndex)" class="mt-1">
                  <v-chip color="warning" size="small" variant="tonal">
                    <v-icon start size="x-small">mdi-alert</v-icon>
                    Unsaved
                  </v-chip>
                </div>
              </div>
            </v-card-title>
          </v-card>
        </div>
        <v-divider v-if="index < filteredAndSortedFixtures.length - 1" class="my-2" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { ParsedFixturePrompt } from "@/types/FixtureTypes";
import IconButton from "@/components/primitives/buttons/IconButton.vue";

defineProps<{
  fixtures: ParsedFixturePrompt[];
  filteredAndSortedFixtures: Array<{ fixture: ParsedFixturePrompt; originalIndex: number }>;
  unsavedChanges: Set<number>;
  error?: string;
  getFixtureSummary: (
    fixture: ParsedFixturePrompt,
    index: number,
    unsavedChanges: Set<number>
  ) => {
    index: number;
    competition: string;
    grade: string;
    ageGroup: string;
    date: string;
    ground: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: string;
    awayScore: string;
    status: string;
    hasUnsavedChanges: boolean;
  };
}>();

defineEmits<{
  "edit-fixture": [index: number];
}>();

// Responsive min-height: larger for desktop, smaller for mobile
const { mdAndUp } = useDisplay();
const minHeightStyle = computed(() => {
  return mdAndUp.value ? "450px" : "250px";
});
</script>
