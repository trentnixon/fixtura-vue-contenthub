<!-- src/components/ArticleTypes/UpcomingFixtures.vue -->
<template>
  <div class="pa-4 text-body" :id="copyID">
    <!-- Iterate through each fixture -->
    <div v-for="fixture in fixtures" :key="fixture.match" class="mb-4">
      <!-- Fixture Match -->
      <h4 class="article-title">{{ fixture.match }}</h4>

      <!-- Date and Time -->
      <h5 class="article-subtitle">{{ fixture.date }} : {{ fixture.time }}</h5>

      <!-- Ground -->
      <p class="article-body">{{ fixture.ground }}</p>

      <!-- Summary -->
      <p class="article-body">{{ fixture.summary }}</p>

      <!-- Divider Between Fixtures -->
      <v-divider class="my-4"></v-divider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import { UpcomingFixturesArticle } from "@/types/ArticleTypes";

const props = defineProps<{
  selectedArticle: UpcomingFixturesArticle;
  copyID: string;
}>();

console.log("[upcomingfixtures]", props.selectedArticle);
const displayArticle = computed(() => props.selectedArticle.structuredOutput);
const fixtures = computed(() => displayArticle.value.fixtures);

// Copy function
async function copyArticle(): Promise<void> {
  try {
    let content = "";
    fixtures.value.forEach((fixture) => {
      content += `${fixture.match}\n${fixture.date} : ${fixture.time}\n${fixture.ground}\n\n${fixture.summary}\n\n`;
    });

    await navigator.clipboard.writeText(content);
    console.log("Upcoming fixtures copied to clipboard.");
  } catch (err) {
    console.error("Failed to copy upcoming fixtures:", err);
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
</style>
