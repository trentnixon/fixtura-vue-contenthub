<!-- src/components/ArticleTypes/WeekendWrapUp.vue -->
<template>
  <div class="pa-4 text-body" :id="copyID">
    <!-- Check if results exist -->
    <div v-if="results.length > 0">
      <!-- Iterate through each result -->
      <div v-for="(result, index) in results" :key="index" class="mb-4">
        <!-- Subtitle -->
        <p class="article-title">
          {{ result.subtitle }}
        </p>

        <!-- Match and Scores -->
        <h5 class="article-subtitle">
          {{ result.team1 }} {{ result.score1 }} vs {{ result.team2 }}
          {{ result.score2 }}
        </h5>

        <!-- Highlights -->
        <p class="article-body">
          {{ result.highlights }}
        </p>

        <!-- Divider Between Results -->
        <v-divider class="my-4"></v-divider>
      </div>
    </div>
    <div v-else>
      <p class="article-body">No weekend results available.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import { WeekendWrapUpArticle, WeekendResult } from "@/types/ArticleTypes";

const props = defineProps<{
  selectedArticle: WeekendWrapUpArticle[]; // Now an array
  copyID: string;
}>();

// Flatten all results from the array of articles
const results = computed<WeekendResult[]>(() => {
  if (!props.selectedArticle || !Array.isArray(props.selectedArticle)) {
    return [];
  }
  return props.selectedArticle.reduce<WeekendResult[]>((acc, article) => {
    if (
      article.structuredOutput &&
      Array.isArray(article.structuredOutput.results)
    ) {
      return acc.concat(article.structuredOutput.results);
    }
    return acc;
  }, []);
});

console.log(
  "[WeekendWrapUp.vue] props.selectedArticle:",
  props.selectedArticle
);
console.log("[WeekendWrapUp.vue] results:", results.value);

// Copy function that returns a Promise
async function copyArticle(): Promise<void> {
  try {
    if (!results.value || !Array.isArray(results.value)) {
      throw new Error("Results data is not available.");
    }

    let content = "";
    results.value.forEach((result) => {
      content += `${result.subtitle}\n`;
      content += `${result.team1} ${result.score1} vs ${result.team2} ${result.score2}\n\n`;
      content += `${result.highlights}\n\n`;
    });

    await navigator.clipboard.writeText(content);
    console.log("Weekend results copied to clipboard.");
  } catch (err) {
    console.error("Failed to copy weekend results:", err);
    throw err; // Propagate the error to the parent if needed
  }
}

// Expose the copyArticle method to the parent
// eslint-disable-next-line
defineExpose({
  copyArticle,
});
</script>

<style scoped>
/* Styling handled by SASS utility classes */
/* If custom styles are needed, they can be added here */
</style>
