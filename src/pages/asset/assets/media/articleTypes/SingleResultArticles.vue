<template>
  <div :id="copyID" class="pa-4 text-body">
    <div class="article-subtitle">
      {{ team1 }} {{ score1 }} vs {{ team2 }} {{ score2 }}
    </div>
    <div class="article-title">{{ title }}</div>
    <div class="article-subtitle">{{ subtitle }}</div>

    <div class="article-body">{{ articleBody }}</div>
    <div class="article-body">{{ highlights }}</div>

    <!-- Match Information -->

    <div class="article-body">Winner: {{ winner }}</div>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";

// Define the props
const props = defineProps({
  articles: Object, // Assuming this will be passed as a plain object
  copyID: String,
});

console.log("props.articles ", props.articles[0]);
// Extract article data using computed properties
const title = computed(
  () => props.articles[0]?.structuredOutput?.title || "No Title"
);
const subtitle = computed(
  () => props.articles[0]?.structuredOutput?.subtitle || "No Subtitle"
);
const articleBody = computed(
  () => props.articles[0]?.structuredOutput?.article_body || "No Article Body"
);
const highlights = computed(
  () => props.articles[0]?.structuredOutput?.highlights || "No Highlights"
);

const team1 = computed(
  () => props.articles[0]?.structuredOutput?.team1 || "Team 1"
);
const team2 = computed(
  () => props.articles[0]?.structuredOutput?.team2 || "Team 2"
);
const score1 = computed(
  () => props.articles[0]?.structuredOutput?.score1 || "0"
);
const score2 = computed(
  () => props.articles[0]?.structuredOutput?.score2 || "0"
);
const winner = computed(
  () => props.articles[0]?.structuredOutput?.winner || "No Winner"
);

// Copy function that returns a Promise
async function copyArticle() {
  try {
    const content = `
      Title: ${title.value}
      Subtitle: ${subtitle.value}

      Match:
      ${team1.value} ${score1.value} vs ${team2.value} ${score2.value}
      Winner: ${winner.value}

      Article:
      ${articleBody.value}

      Highlights:
      ${highlights.value}
    `.trim();

    await navigator.clipboard.writeText(content);
    console.log("Article copied to clipboard.");
  } catch (err) {
    console.error("Failed to copy article:", err);
    throw err;
  }
}

// Expose the copyArticle method to the parent
// eslint-disable-next-line
defineExpose({
  copyArticle,
});
</script>

<style scoped>
/* Add any required styles for this component */
</style>
