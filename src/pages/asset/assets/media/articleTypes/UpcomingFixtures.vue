<template>
  <div class="pa-4 text-body" :id="copyID">
    <!-- Check if fixtures exist -->
    <div v-if="fixtures.length > 0">
      <!-- Iterate through each fixture -->
      <div v-for="(fixture, index) in fixtures" :key="index" class="mb-4">
        <!-- Fixture Match -->
        <h4 class="article-title">{{ fixture.match }}</h4>

        <!-- Date and Time -->
        <h5 class="article-subtitle">
          {{ fixture.date }} : {{ fixture.time }}
        </h5>

        <!-- Ground -->
        <p class="article-body" v-if="fixture.ground !== 'N/A'">
          {{ fixture.ground }}
        </p>

        <!-- Summary -->
        <p class="article-body">{{ fixture.summary }}</p>

        <!-- Divider Between Fixtures -->
        <v-divider class="my-4"></v-divider>
      </div>
    </div>
    <div v-else>
      <p class="article-body">No upcoming fixtures available.</p>
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

console.log("[CricketUpcomingFixtures] articles:", props.articles);

// Format the fixtures from the articles
const fixtures = computed(() => {
  const aiArticles = props.articles || [];
  // Extract fixtures from the structuredOutput of articles
  return aiArticles.flatMap((article) => {
    return article.structuredOutput?.fixtures || [];
  });
});

// Copy function to copy all the fixtures to the clipboard
async function copyArticle() {
  try {
    if (fixtures.value.length === 0) {
      throw new Error("No fixtures available to copy.");
    }

    // Combine all fixture content into a single string
    let content = "";
    fixtures.value.forEach((fixture) => {
      content += `${fixture.match}\n${fixture.date} : ${fixture.time}\n${fixture.ground}\n\n${fixture.summary}\n\n`;
    });

    // Copy the content to the clipboard
    await navigator.clipboard.writeText(content);
    //console.log("Upcoming fixtures copied to clipboard.");
  } catch (err) {
    console.error("Failed to copy upcoming fixtures:", err);
    throw err;
  }
}

// Expose the copyArticle method to the parent
defineExpose({
  copyArticle,
});
</script>

<style scoped>
/* Any specific styling can be added here */
</style>
