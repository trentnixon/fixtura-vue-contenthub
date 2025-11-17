<template>
  <MediaLayout>
    <!-- Named slot for the header -->
    <template v-slot:header>
      <CategoryHeader title="ARTICLES" icon="mdi-newspaper-variant-outline" />
      <v-spacer></v-spacer>
      <!-- <v-btn color="primary" @click="navigateToEdit()"> Edit Writeup </v-btn> -->
      <!-- Copy Button in the Header - Only show when there's a valid article -->
      <SecondaryButton v-if="hasValidArticle" color="accent" :icon="copyIcon" label="Copy" @click="handleCopy"
        :loading="copyLoading" size="small" />
    </template>

    <!-- Conditionally rendering named slots -->
    <!-- Loading State -->
    <template v-slot:loading v-if="loading">
      <v-progress-linear indeterminate color="primary" class="mt-4"></v-progress-linear>
      <p class="mt-2">Loading articles...</p>
    </template>

    <!-- Legacy Article Check - Show BEFORE routing to article type components -->
    <template v-slot:body v-else-if="articlesArray.length > 0 && isLegacy">
      <v-sheet class="overflow-y-auto" :max-height="maxHeight">
        <div class="text-center pa-8">
          <v-icon color="warning" size="64" class="mb-6">mdi-alert</v-icon>
          <p class="text-h6 font-weight-bold mb-3">Legacy Article Detected</p>
          <p class="article-body mb-4">
            This Article is no longer compatible with the new AI system.
          </p>
        </div>
      </v-sheet>
    </template>

    <!-- Body Slot - Show article type components only if NOT legacy -->
    <template v-slot:body v-else-if="articlesArray.length > 0 && !isLegacy">
      <!-- Assign a ref to the child component -->
      <v-sheet class="overflow-y-auto" :max-height="maxHeight">
        <component :is="assetComponent" :articles="articlesArray" :copyID="generateCopyID()" ref="articleComponent"
          :accountId="route.params.accountid" :renderId="route.params.renderid" />
      </v-sheet>
    </template>

    <!-- No Content Slot -->
    <template v-slot:noContent v-else>
      <v-alert type="info" class="mt-4"> AI Articles are Currently Disabled. </v-alert>
    </template>
  </MediaLayout>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watch } from "vue";
import { useDisplay } from "vuetify";

import MediaLayout from "@/components/containers/media/mediaLayout.vue";
import CategoryHeader from "@/components/primitives/headers/CategoryHeader.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
/* Import additional article components as needed */
import Top5Listicle from "./articleTypes/Top5Listicle.vue";
import LadderSummary from "./articleTypes/LadderSummary.vue";
import UpcomingFixtures from "./articleTypes/UpcomingFixtures.vue";
import WeekendWrapUp from "./articleTypes/WeekendWrapUp.vue";
import SingleResultArticles from "./articleTypes/SingleResultArticles.vue";
import { useRoute } from "vue-router";
import { useLegacyCheck } from "@/composables/aiArticles/useLegacyCheck";
import type { FlattenedArticle } from "@/types/ArticleTypes";

const route = useRoute();

const props = defineProps({
  articles: {
    type: Object, // Assuming articles is an object containing structured output
    required: true,
  },
});

const assetType = ref(route.params.asset);
const { name } = useDisplay();
const loading = ref(true);

// Normalize articles to array format
const articlesArray = computed<FlattenedArticle[]>(() => {
  if (Array.isArray(props.articles)) {
    // Handle CricketResults which might be nested array
    if (props.articles.length > 0 && Array.isArray(props.articles[0])) {
      return props.articles[0] as FlattenedArticle[];
    }
    return props.articles as FlattenedArticle[];
  }
  return [];
});

// Check if articles are legacy BEFORE routing to article type components
const { isLegacy } = useLegacyCheck(articlesArray);

// Check if there's a valid article written (has actual content, not just placeholders)
const hasValidArticle = computed(() => {
  // Must have articles and not be legacy
  if (articlesArray.value.length === 0 || isLegacy.value) {
    return false;
  }

  // Check if articles have actual content (structuredOutput with non-placeholder values)
  return articlesArray.value.some((article: any) => {
    const structuredOutput = article?.structuredOutput;
    if (!structuredOutput) return false;

    // For WeekendWrapUp (CricketResults), check results array
    if (assetType.value === "CricketResults") {
      const results = structuredOutput.results;
      if (!Array.isArray(results) || results.length === 0) return false;
      // Check if any result has valid content
      return results.some((result: any) => {
        const hasValidTitle = result.title &&
          result.title !== "No Title" &&
          result.title.trim() !== "";
        const hasValidSubtitle = result.subtitle &&
          result.subtitle !== "No Subtitle" &&
          result.subtitle.trim() !== "";
        const hasValidBody = result.article_body &&
          result.article_body !== "No Article Body" &&
          result.article_body.trim() !== "";
        return hasValidTitle && hasValidSubtitle && hasValidBody;
      });
    }

    // For Top5 articles, check topScorers array
    if (assetType.value === "CricketTop5Bowling" || assetType.value === "CricketTop5Batting") {
      return structuredOutput.topScorers &&
        Array.isArray(structuredOutput.topScorers) &&
        structuredOutput.topScorers.length > 0;
    }

    // For UpcomingFixtures, check fixtures array
    if (assetType.value === "CricketUpcoming") {
      return structuredOutput.fixtures &&
        Array.isArray(structuredOutput.fixtures) &&
        structuredOutput.fixtures.length > 0;
    }

    // For Ladder, check leagues array
    if (assetType.value === "CricketLadder") {
      return structuredOutput.leagues &&
        Array.isArray(structuredOutput.leagues) &&
        structuredOutput.leagues.length > 0;
    }

    // For SingleResultArticles, check title/subtitle and article body directly
    if (assetType.value === "CricketResultSingle") {
      const hasValidTitle = structuredOutput.title &&
        structuredOutput.title !== "No Title" &&
        structuredOutput.title.trim() !== "";
      const hasValidSubtitle = structuredOutput.subtitle &&
        structuredOutput.subtitle !== "No Subtitle" &&
        structuredOutput.subtitle.trim() !== "";
      const hasValidBody = structuredOutput.article_body &&
        structuredOutput.article_body !== "No Article Body" &&
        structuredOutput.article_body.trim() !== "";
      return hasValidTitle && hasValidSubtitle && hasValidBody;
    }

    // Default: no valid article for unknown types
    return false;
  });
});

// Copy button state
const copyIcon = ref("mdi-content-copy");
const copyLoading = ref(false);

// Reference to the child component
const articleComponent = ref<any>(null);

// Define the dynamic component based on the asset type
const assetComponent = computed(() => {
  switch (assetType.value) {
    case "CricketTop5Bowling":
    case "CricketTop5Batting":
      return Top5Listicle;
    case "CricketLadder":
      return LadderSummary;
    case "CricketUpcoming":
      return UpcomingFixtures;
    case "CricketResults":
      return WeekendWrapUp;
    case "CricketResultSingle":
      return SingleResultArticles;
    default:
      return null;
  }
});
const generateCopyID = () => {
  return `copy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Watch for changes in the articles prop and update the loading state
watch(
  () => props.articles,
  () => {
    loading.value = false;
  },
  { immediate: true }
);

// Handle copy action
async function handleCopy() {
  if (
    articleComponent.value &&
    typeof articleComponent.value.copyArticle === "function"
  ) {
    try {
      copyLoading.value = true;
      copyIcon.value = "mdi-loading"; // Optional: Change icon to indicate loading

      await articleComponent.value.copyArticle();

      // Show success icon
      copyIcon.value = "mdi-check";
      // Reset to copy icon after 1 second
      setTimeout(() => {
        copyIcon.value = "mdi-content-copy";
        copyLoading.value = false;
      }, 1000);
    } catch (err) {
      console.error("Failed to copy article:", err);
      // Reset to copy icon on error
      copyIcon.value = "mdi-content-copy";
      copyLoading.value = false;
      // Optionally show error message to user
    }
  } else {
    console.warn("Copy function is not available on the child component.");
  }
}

/* function navigateToEdit() {
  router.push({
    name: "editAIWriteup",
    params: { ...route.params },
  });
}
 */
const maxHeight = computed(() => {
  switch (name.value) {
    case "xs":
      return "500px";
    case "sm":
      return "400px";
    case "md":
      return "450px";
    case "lg":
      return "580px";
    case "xl":
      return "700px";
    default:
      return "600px";
  }
});
</script>
