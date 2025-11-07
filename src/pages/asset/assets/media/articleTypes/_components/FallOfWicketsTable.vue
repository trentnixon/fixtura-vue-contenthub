<template>
  <div class="mb-3">
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-subtitle-2">Fall of Wickets</span>
      <v-chip size="small" variant="tonal" color="info">
        One wicket per line
      </v-chip>
    </div>
    <v-textarea :model-value="formattedText" @update:model-value="handleTextChange" label="Fall of Wickets"
      hint="Format: Wicket Number - Score, Batsman Name (or just: Score - Batsman Name)" persistent-hint
      variant="outlined" density="compact" rows="5"
      placeholder="Example:&#10;1 - 10/1, John Smith&#10;2 - 50/2, Jane Doe&#10;Or:&#10;10/1 - John Smith&#10;50/2 - Jane Doe" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { FallOfWickets } from "@/types/FixtureTypes";

const props = defineProps<{
  fallOfWickets: FallOfWickets[];
}>();

const emit = defineEmits<{
  "update:fallOfWickets": [value: FallOfWickets[]];
}>();

// Format FallOfWickets array to readable text
const formattedText = computed(() => {
  // Debug: Always log to see what we're receiving
  console.log("=== FallOfWickets Debug ===");
  console.log("props.fallOfWickets:", props.fallOfWickets);
  console.log("typeof props.fallOfWickets:", typeof props.fallOfWickets);
  console.log("Array.isArray(props.fallOfWickets):", Array.isArray(props.fallOfWickets));
  console.log("props.fallOfWickets?.length:", props.fallOfWickets?.length);

  if (props.fallOfWickets) {
    console.log("FallOfWickets JSON:", JSON.stringify(props.fallOfWickets, null, 2));
    props.fallOfWickets.forEach((wicket, idx) => {
      console.log(`Wicket ${idx}:`, JSON.stringify(wicket, null, 2));
      console.log(`  - wicketNumber:`, wicket.wicketNumber, `(type: ${typeof wicket.wicketNumber})`);
      console.log(`  - score:`, wicket.score, `(type: ${typeof wicket.score})`);
      console.log(`  - batsman:`, wicket.batsman, `(type: ${typeof wicket.batsman})`);
    });
  }

  if (!props.fallOfWickets || props.fallOfWickets.length === 0) {
    console.log("Returning empty string - no fallOfWickets data");
    return "";
  }

  // Filter out empty entries and format valid ones
  const validWickets = props.fallOfWickets
    .map((wicket, index) => {
      const wicketNum = wicket.wicketNumber && wicket.wicketNumber > 0 ? wicket.wicketNumber : index + 1;
      const score = wicket.score && wicket.score !== "undefined" ? wicket.score.trim() : "";
      const batsman = wicket.batsman ? wicket.batsman.trim() : "";

      console.log(`Processing wicket ${index}: wicketNum=${wicketNum}, score="${score}", batsman="${batsman}"`);

      // Only include if there's meaningful data
      if (score || batsman) {
        if (score && batsman) {
          return `${wicketNum} - ${score}, ${batsman}`;
        } else if (score) {
          return `${wicketNum} - ${score}`;
        } else if (batsman) {
          return `${wicketNum} - ${batsman}`;
        }
      }
      return null;
    })
    .filter(line => line !== null);

  console.log("Valid wickets result:", validWickets);
  return validWickets.join("\n");
});

// Parse textarea content back to FallOfWickets array
function handleTextChange(text: string) {
  if (!text || text.trim() === "") {
    emit("update:fallOfWickets", []);
    return;
  }

  const lines = text.split("\n").filter(line => line.trim() !== "");
  const wickets: FallOfWickets[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    try {
      // Parse format: "Wicket Number - Score, Batsman Name"
      // Example: "1 - 10/1, John Smith"
      let match = line.match(/^(\d+)\s*-\s*(.+?)\s*,\s*(.+)$/);

      if (match) {
        const [, wicketNumber, score, batsman] = match;

        wickets.push({
          wicketNumber: parseInt(wicketNumber, 10) || i + 1,
          score: score.trim(),
          batsman: batsman.trim(),
        });
      } else {
        // Try format without wicket number: "Score - Batsman Name"
        // Example: "10/1 - John Smith"
        match = line.match(/^(.+?)\s*-\s*(.+)$/);

        if (match) {
          const [, score, batsman] = match;

          wickets.push({
            wicketNumber: i + 1, // Auto-number based on line order
            score: score.trim(),
            batsman: batsman.trim(),
          });
        } else {
          // Try comma-separated format: "Wicket Number, Score, Batsman"
          match = line.match(/^(\d+)\s*,\s*(.+?)\s*,\s*(.+)$/);

          if (match) {
            const [, wicketNumber, score, batsman] = match;

            wickets.push({
              wicketNumber: parseInt(wicketNumber, 10) || i + 1,
              score: score.trim(),
              batsman: batsman.trim(),
            });
          } else {
            // Fallback: try to extract just score and batsman
            const parts = line.split(",");
            if (parts.length >= 2) {
              wickets.push({
                wicketNumber: i + 1,
                score: parts[0].trim(),
                batsman: parts.slice(1).join(",").trim(),
              });
            } else {
              // Last resort: use the whole line as batsman, empty score
              wickets.push({
                wicketNumber: i + 1,
                score: "",
                batsman: line.trim(),
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn("Failed to parse wicket line:", line, error);
      // Skip invalid lines
    }
  }

  emit("update:fallOfWickets", wickets);
}
</script>
