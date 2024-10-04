<template>
  <div class="pa-4 text-body" :id="copyID">
    <!-- Check if articles exist -->
    <div v-if="topScorers && topScorers.length > 0">
      <!-- Article Title -->
      <h4 class="article-title">{{ title }}</h4>
      <p class="article-subtitle">{{ subtitle }}</p>

      <!-- Divider -->
      <v-divider class="my-4"></v-divider>

      <!-- Top Scorers List -->
      <div v-for="(scorer, index) in topScorers" :key="index" class="mb-4">
        <!-- Scorer Position and Name -->
        <h5 class="article-title">
          {{ scorer.position }}. {{ scorer.player_name }}
        </h5>

        <!-- Performance Stats -->
        <p class="article-body">{{ scorer.performance_stats }}</p>

        <!-- Article Body -->
        <p class="article-body">{{ scorer.article_body }}</p>

        <!-- Divider Between Scorers -->
        <v-divider class="my-4"></v-divider>
      </div>
    </div>
    <div v-else>
      <p class="article-body">No top 5 performances available.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import { Top5ListicleArticle } from "@/types/ArticleTypes";
// Define props, accepting the article and copyID
const props = defineProps({
  articles: Array,
  copyID: String,
});

// Extract the structured data
const formattedArticles = computed(() => {
  const aiArticles = (props.articles || []) as Top5ListicleArticle[];
  return aiArticles.map((article) => ({
    title: article.structuredOutput?.title || "No Title",
    subtitle: article.structuredOutput?.subtitle || "No Subtitle",
    topScorers: article.structuredOutput?.top_scorers || [],
    socialMediaPost: article.structuredOutput?.social_media_post || "",
    twitterPost: article.structuredOutput?.twitter_post || "",
  }));
});

// Use the first article (assuming a single Top 5 list)
const article = computed(() => formattedArticles.value[0]);

// Extract title, subtitle, and top scorers
const title = computed(() => article.value?.title);
const subtitle = computed(() => article.value?.subtitle);
const topScorers = computed(() => article.value?.topScorers);

// Copy function for the article content
async function copyArticle() {
  try {
    let content = `${title.value}\n\n${subtitle.value}\n\n${topScorers.value
      .map(
        (scorer) => `
${scorer.position}. ${scorer.player_name}
${scorer.performance_stats}
${scorer.article_body}
`
      )
      .join("\n")}`;

    await navigator.clipboard.writeText(content);
    console.log("Top 5 article copied to clipboard.");
  } catch (err) {
    console.error("Failed to copy Top 5 article:", err);
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
/* Add any specific styling if required */
</style>
