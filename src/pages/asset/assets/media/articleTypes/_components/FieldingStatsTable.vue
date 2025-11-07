<template>
  <div class="mb-3">
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-subtitle-2">Fielding Stats</span>
      <v-chip size="small" variant="tonal" color="grey" style="color: rgba(0, 0, 0, 0.87);">
        One fielder per line
      </v-chip>
    </div>
    <v-textarea :model-value="formattedText" @update:model-value="handleTextChange" label="Fielding Stats"
      hint="Enter fielding stats description, one per line" persistent-hint variant="outlined" density="compact"
      rows="5"
      placeholder="Example:&#10;Callum Hewetson, 0 catches, 0 run outs, 0 stumpings, 0 fielding dismissals&#10;Luke Kenworthy (c), 2 catches, 0 run outs, 0 stumpings, 0 fielding dismissals" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { FieldingStats } from "@/types/FixtureTypes";

const props = defineProps<{
  fieldingStats: FieldingStats[];
}>();

const emit = defineEmits<{
  "update:fieldingStats": [value: FieldingStats[]];
}>();

// Format FieldingStats array to readable text (just the description strings)
const formattedText = computed(() => {
  if (!props.fieldingStats || props.fieldingStats.length === 0) {
    return "";
  }

  return props.fieldingStats
    .map((fielder) => fielder.description || "")
    .filter(desc => desc.trim() !== "")
    .join("\n");
});

// Parse textarea content back to FieldingStats array
function handleTextChange(text: string) {
  if (!text || text.trim() === "") {
    emit("update:fieldingStats", []);
    return;
  }

  const lines = text.split("\n").filter(line => line.trim() !== "");
  const fielders: FieldingStats[] = lines.map((line) => ({
    description: line.trim(),
  }));

  emit("update:fieldingStats", fielders);
}
</script>
