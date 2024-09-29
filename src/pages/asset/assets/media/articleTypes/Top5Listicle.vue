<!-- src/components/ArticleTypes/Top5Listicle.vue -->
<template>
  <div class="pa-4" :id="copyID">
    <!-- Article Title -->
    <h4 class="article-title">{{ title }}</h4>

    <!-- Article Subtitle -->
    <h5 class="article-subtitle">{{ subtitle }}</h5>

    <!-- Divider -->
    <v-divider class="my-4"></v-divider>

    <!-- Top Scorers List -->
    <div v-for="scorer in topScorers" :key="scorer.player_name" class="mb-4">
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
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import { Top5ListicleArticle } from "@/types/ArticleTypes";

const props = defineProps<{
  selectedArticle: Top5ListicleArticle;
  copyID: string;
}>();

const displayArticle = computed(() => props.selectedArticle.structuredOutput);
const title = computed(() => displayArticle.value.title);
const subtitle = computed(() => displayArticle.value.subtitle);
const topScorers = computed(() => displayArticle.value.top_scorers);

// Copy function
function copyArticle() {
  let content = `${title.value}\n\n${
    subtitle.value
  }\n\n${displayArticle.value.top_scorers
    .map(
      (scorer) => `
${scorer.position}. ${scorer.player_name}
${scorer.performance_stats}
${scorer.article_body}
`
    )
    .join("\n")}`;

  navigator.clipboard
    .writeText(content)
    .then(() => {
      console.log("Article content copied to clipboard.");
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
    });
}

// Expose the copyArticle method to the parent
// eslint-disable-next-line no-undef
defineExpose({
  copyArticle,
});
</script>
