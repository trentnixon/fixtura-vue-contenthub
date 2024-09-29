<!-- src/components/ArticleTypes/SingleResultArticles.vue -->
<template>
  <div :id="copyID" class="pa-4 text-body">
    <div class="article-title">
      {{ selectedArticle.structuredOutput.title }}
    </div>
    <div class="article-subtitle">
      {{ selectedArticle.structuredOutput.subtitle }}
    </div>
    <div class="article-body">
      {{ selectedArticle.structuredOutput.article_body }}
    </div>
    <div class="article-body">
      {{ selectedArticle.structuredOutput.highlights }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { WeekendSingleGameResult } from "@/types/ArticleTypes";

const props = defineProps<{
  selectedArticle: WeekendSingleGameResult;
  copyID: string;
}>();

// Copy function that returns a Promise
async function copyArticle(): Promise<void> {
  try {
    const { title, subtitle, article_body, highlights } =
      props.selectedArticle.structuredOutput;
    const content = `
  Title: ${title}
  Subtitle: ${subtitle}

  Article:
  ${article_body}

  Highlights:
  ${highlights}
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
