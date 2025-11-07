<template>
  <div class="mb-3">
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-subtitle-2">Batting Order</span>
      <v-chip size="small" variant="tonal" color="grey" style="color: rgba(0, 0, 0, 0.87);">
        One player per line
      </v-chip>
    </div>
    <v-textarea :model-value="formattedText" @update:model-value="handleTextChange" label="Player Performances"
      hint="Enter player performance description, one per line" persistent-hint variant="outlined" density="compact"
      rows="8"
      placeholder="Example:&#10;Christian Leopard (vc), scored 86 Runs from (77) balls, with 11 fours and 2 sixes, at a strike Rate of 111.68., they were out: c: Sachin Jayawardena b: Oliver Beale&#10;Harrison Woolley, scored 95 Runs from (81) balls, with 11 fours and 5 sixes, at a strike Rate of 117.28., they were out: c: Luke Kenworthy b: Ben Stoyanoff" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PlayerStats } from "@/types/FixtureTypes";

const props = defineProps<{
  battingOrder: PlayerStats[];
}>();

const emit = defineEmits<{
  "update:battingOrder": [value: PlayerStats[]];
}>();

// Format PlayerStats array to readable text (just the description strings)
const formattedText = computed(() => {
  if (!props.battingOrder || props.battingOrder.length === 0) {
    return "";
  }

  return props.battingOrder
    .map((player) => player.description || "")
    .filter(desc => desc.trim() !== "")
    .join("\n");
});

// Parse textarea content back to PlayerStats array
function handleTextChange(text: string) {
  if (!text || text.trim() === "") {
    emit("update:battingOrder", []);
    return;
  }

  const lines = text.split("\n").filter(line => line.trim() !== "");
  const players: PlayerStats[] = lines.map((line) => ({
    description: line.trim(),
  }));

  emit("update:battingOrder", players);
}
</script>
