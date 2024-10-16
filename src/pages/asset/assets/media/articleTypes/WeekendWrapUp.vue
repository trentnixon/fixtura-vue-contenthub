<template>
  <div class="pa-4 text-body" :id="copyID">
    <!-- Check if articles exist -->
    <div v-if="formattedArticles.length > 0">
      <!-- Iterate through each article -->
      <div v-for="(article, index) in formattedArticles" :key="index" class="mb-4">
        <h4 class="article-title">{{ article.title }}</h4>
        <p class="article-subtitle">{{ article.subtitle }}</p>
        <h5 class="article-subtitle">
          {{ article.team1 }} {{ article.score1 }} vs {{ article.team2 }}
          {{ article.score2 }}
        </h5>
        <p class="article-body">{{ article.articleBody }}</p>
        <p class="article-body">{{ article.highlights }}</p>
        <v-divider class="my-4"></v-divider>
      </div>
    </div>
    <div v-else>
      <p class="article-body">No articles available.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineExpose } from "vue";

// Define the props
const props = defineProps({
  articles: Array,
  copyID: String,
});

console.log("[aiArticles]", props.articles);

// Format the articles within the component
const formattedArticles = computed(() => {
  const aiArticles = props.articles || [];
  //console.log("[formattedArticles]", aiArticles);
  // Return formatted AI articles based on structuredOutput results
  return aiArticles.flatMap((article) => {
    const results = article.structuredOutput?.results || [];
    // Map each result as a separate formatted article
    return results.map((result) => ({
      id: article.id,
      name: article.name || "Unknown Article",
      title: result.title || "No Title",
      subtitle: result.subtitle || "No Subtitle",
      articleBody: result.article_body || "No Article Body",
      highlights: result.highlights || "No Highlights",
      team1: result.team1 || "Team 1",
      team2: result.team2 || "Team 2",
      score1: result.score1 || "0",
      score2: result.score2 || "0",
      winner: result.winner || "No Winner",
      assetType: article.assetType || "Unknown Type",
      assetCategory: article.assetCategory || "Unknown Category",
      hasError: article.hasError || false,
      errorHandler: article.errorHandler || null,
      hasCompleted: article.hasCompleted || false,
      forceRerender: article.forceRerender || false,
      compositionID: article.compositionID || "Unknown Composition",
    }));
  });
});

// Function to handle copying the article content to the clipboard
async function copyArticle() {
  try {
    if (!formattedArticles.value || formattedArticles.value.length === 0) {
      throw new Error("No articles available to copy.");
    }

    // Combine all article content into a single string
    let content = "";
    formattedArticles.value.forEach((article) => {
      content += `${article.title}\n`;
      content += `${article.subtitle}\n`;
      content += `${article.team1} ${article.score1} vs ${article.team2} ${article.score2}\n\n`;
      content += `${article.articleBody}\n\n`;
      content += `Highlights: ${article.highlights}\n\n`;
    });

    // Copy the content to the clipboard
    await navigator.clipboard.writeText(content);
    //console.log("Articles copied to clipboard.");
  } catch (err) {
    console.error("Failed to copy articles:", err);
    throw err;
  }
}

// Expose the copyArticle method to the parent
defineExpose({
  copyArticle,
});
</script>
