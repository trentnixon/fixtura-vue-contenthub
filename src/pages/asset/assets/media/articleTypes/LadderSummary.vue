<template>
  <div class="pa-4" :id="copyID">
    <!-- Check if leagues exist -->
    <div v-if="leagues && leagues.length > 0">
      <!-- Iterate through each league -->
      <div v-for="(league, index) in leagues" :key="index" class="mb-4">
        <!-- League Title and Subtitle -->
        <h4 class="article-title">{{ league.title }}</h4>
        <p class="article-subtitle">{{ league.subtitle }}</p>

        <!-- Article Body -->
        <p class="article-body">{{ league.article_body }}</p>

        <!-- Divider Between Leagues -->
        <v-divider class="my-4"></v-divider>
      </div>
    </div>
    <div v-else>
      <p class="article-body">No ladder information available.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";

// Define props
const props = defineProps({
  articles: Array,
  copyID: String,
});

// Extract leagues from the structured article data
const formattedArticles = computed(() => {
  const aiArticles = props.articles || [];
  return aiArticles.map((article) => ({
    id: article.id,
    title: article.structuredOutput?.leagues?.[0]?.title || "No Title",
    subtitle: article.structuredOutput?.leagues?.[0]?.subtitle || "No Subtitle",
    leagues: article.structuredOutput?.leagues || [],
  }));
});

// Use the first article (assuming one ladder summary)
const article = computed(() => formattedArticles.value[0]);

// Extract title, subtitle, and leagues
const leagues = computed(() => article.value?.leagues || []);

// Copy function for the article content
async function copyArticle() {
  try {
    let content = leagues.value
      .map(
        (league) =>
          `${league.title}\n${league.subtitle}\n${league.article_body}\n\n`
      )
      .join("\n");

    await navigator.clipboard.writeText(content);
    //console.log("Ladder summary copied to clipboard.");
  } catch (err) {
    console.error("Failed to copy ladder summary:", err);
    throw err;
  }
}

// Expose the copyArticle method to the parent
// eslint-disable-next-line no-undef
defineExpose({
  copyArticle,
});
</script>

<style scoped>
/* Any specific styling can be added here */
</style>
