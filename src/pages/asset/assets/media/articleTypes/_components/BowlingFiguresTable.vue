<template>
  <div class="mb-3">
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-subtitle-2">Bowling Figures</span>
      <v-chip size="small" variant="tonal" color="grey" style="color: rgba(0, 0, 0, 0.87);">
        One bowler per line
      </v-chip>
    </div>
    <v-textarea :model-value="formattedText" @update:model-value="handleTextChange" label="Bowling Figures"
      hint="Enter bowling figure description, one per line" persistent-hint variant="outlined" density="compact"
      rows="6"
      placeholder="Example:&#10;Ben Stoyanoff, bowled 10 overs, took 3 wickets for 67 runs, with 1 maiden, at an economy of 6.70.&#10;Nihal Shilar, bowled 9 overs, took 4 wickets for 59 runs, at an economy of 6.55." />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BowlingFigures } from "@/types/FixtureTypes";

const props = defineProps<{
  bowlingFigures: BowlingFigures[];
}>();

const emit = defineEmits<{
  "update:bowlingFigures": [value: BowlingFigures[]];
}>();

// Format BowlingFigures array to readable text (just the description strings)
const formattedText = computed(() => {
  if (!props.bowlingFigures || props.bowlingFigures.length === 0) {
    return "";
  }

  return props.bowlingFigures
    .map((bowler) => bowler.description || "")
    .filter(desc => desc.trim() !== "")
    .join("\n");
});

// Parse textarea content back to BowlingFigures array
function handleTextChange(text: string) {
  if (!text || text.trim() === "") {
    emit("update:bowlingFigures", []);
    return;
  }

  const lines = text.split("\n").filter(line => line.trim() !== "");
  const bowlers: BowlingFigures[] = lines.map((line) => ({
    description: line.trim(),
  }));

  emit("update:bowlingFigures", bowlers);
}
</script>
