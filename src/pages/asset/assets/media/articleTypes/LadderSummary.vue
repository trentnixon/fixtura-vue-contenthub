<!-- src/components/ArticleTypes/LadderSummary.vue -->
<template>
  <div class="pa-4 text-body" :id="copyID">
    <!-- Iterate through each league -->
    <div v-for="league in leagues" :key="league.title" class="mb-4">
      <!-- League Title -->
      <h5 class="article-title">{{ league.title }}</h5>

      <!-- League Subtitle -->
      <h6 class="article-subtitle">{{ league.subtitle }}</h6>

      <!-- League Article Body -->
      <p class="article-body">{{ league.article_body }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import { LadderSummaryArticle } from "@/types/ArticleTypes";

const props = defineProps<{
  selectedArticle: LadderSummaryArticle;
  copyID: string;
}>();

const displayArticle = computed(() => props.selectedArticle.structuredOutput);
const leagues = computed(() => displayArticle.value.leagues);

// Copy function
function copyArticle(): Promise<void> {
  return new Promise((resolve, reject) => {
    let content = "";
    leagues.value.forEach((league) => {
      content += `${league.title}\n${league.subtitle}\n\n${league.article_body}\n\n`;
    });

    navigator.clipboard
      .writeText(content)
      .then(() => {
        console.log("Ladder summary copied to clipboard.");
        resolve();
      })
      .catch((err) => {
        console.error("Failed to copy ladder summary:", err);
        reject(err);
      });
  });
}

// Expose the copyArticle method to the parent
// eslint-disable-next-line no-undef
defineExpose({
  copyArticle,
});
</script>

<style scoped>
/* Styling handled by SASS utility classes */
</style>
