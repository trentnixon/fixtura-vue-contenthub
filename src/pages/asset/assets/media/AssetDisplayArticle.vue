<template>
  <MediaLayout>
    <!-- Named slot for the header -->
    <template v-slot:header>
      <CategoryHeader title="ARTICLES" icon="mdi-newspaper-variant-outline" />
      <v-spacer></v-spacer>
      <!-- Copy Button in the Header -->
      <SecondaryButton
        color="accent"
        :icon="copyIcon"
        label="Copy"
        @click="handleCopy"
        :loading="copyLoading"
      />
    </template>

    <!-- Conditionally rendering named slots -->
    <!-- Loading State -->
    <template v-slot:loading v-if="loading">
      <v-progress-linear
        indeterminate
        color="primary"
        class="mt-4"
      ></v-progress-linear>
      <p class="mt-2">Loading articles...</p>
    </template>

    <!-- Body Slot -->
    <template v-slot:body v-else-if="articles.length > 0">
      <!-- Assign a ref to the child component -->
      <v-sheet class="overflow-y-auto" :max-height="maxHeight">
        <component
          :is="assetComponent"
          :articles="Array.isArray(articles) ? articles : []"
          :copyID="generateCopyID()"
          ref="articleComponent"
        />
      </v-sheet>
    </template>

    <!-- No Content Slot -->
    <template v-slot:noContent v-else>
      <v-alert type="info" class="mt-4"> No article available </v-alert>
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
import { ArticleComponent } from "@/types/ArticleTypes";
import { useRoute } from "vue-router";
const props = defineProps({
  articles: {
    type: Object, // Assuming articles is an object containing structured output
    required: true,
  },
});
const route = useRoute();

const assetType = ref(route.params.asset);
const { name } = useDisplay();
const loading = ref(true);

// Copy button state
const copyIcon = ref("mdi-content-copy");
const copyLoading = ref(false);

// Reference to the child component using the common interface
const articleComponent = ref<ArticleComponent | null>(null);

// Define the dynamic component based on the asset type
const assetComponent = computed(() => {
  switch (assetType.value) {
    case "top5bowlinglist":
    case "top5battinglist":
      return Top5Listicle;
    case "ladder":
      return LadderSummary;
    case "upcomingfixtures":
      return UpcomingFixtures;
    case "weekendresults":
      return WeekendWrapUp;
    case "weekendsinglegameresult":
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
function handleCopy() {
  if (
    articleComponent.value &&
    typeof articleComponent.value.copyArticle === "function"
  ) {
    copyLoading.value = true;
    copyIcon.value = "mdi-loading"; // Optional: Change icon to indicate loading

    articleComponent.value.copyArticle();

    // Simulate loading state for 2 seconds
    setTimeout(() => {
      copyIcon.value = "mdi-check";
      setTimeout(() => {
        copyIcon.value = "mdi-content-copy";
        copyLoading.value = false;
      }, 1000);
    }, 500); // Adjust delay as needed based on copy speed
  } else {
    console.warn("Copy function is not available on the child component.");
  }
}

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

console.log("[props.articles ]", props.articles);
</script>
