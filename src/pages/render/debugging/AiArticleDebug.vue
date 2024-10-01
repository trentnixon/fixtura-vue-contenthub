<template>
  <v-container fluid class="pa-0">
    <h1>AI Article Debug Information</h1>

    <v-alert v-if="error" type="error" class="mt-4">
      Error: {{ error }}
    </v-alert>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="mt-4"
    ></v-progress-circular>

    <div v-if="aiArticlesByRenderID.length && !loading" class="mt-4">
      <v-expansion-panels flat>
        <!-- Total AI Articles -->
        <v-expansion-panel>
          <v-expansion-panel-title>Total AI Articles</v-expansion-panel-title>
          <v-expansion-panel-text>
            <p>Total: {{ totalAiArticles }}</p>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- AI Articles with Errors -->
        <v-expansion-panel>
          <v-expansion-panel-title
            >AI Articles with Errors</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <p>Total with Errors: {{ aiArticlesWithErrors }}</p>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Grouped by Asset Type -->
        <v-expansion-panel
          v-for="(articles, type) in groupArticlesByAssetType"
          :key="type"
        >
          <v-expansion-panel-title
            >Asset Type: {{ type }}</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <ul>
              <li v-for="article in articles" :key="article.id">
                ID: {{ article.id }} | Name: {{ article.attributes.Name }}
              </li>
            </ul>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Grouped by Asset Category -->
        <v-expansion-panel
          v-for="(articles, category) in groupArticlesByAssetCategory"
          :key="category"
        >
          <v-expansion-panel-title
            >Asset Category: {{ category }}</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <ul>
              <li v-for="article in articles" :key="article.id">
                ID: {{ article.id }} | Name: {{ article.attributes.Name }}
              </li>
            </ul>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAiArticleData } from "@/pages/render/composables/OLD_useAiArticleData";

// Get route parameters
const route = useRoute();
const renderId = Number(route.params.renderid);

const {
  aiArticlesByRenderID,
  fetchAiArticlesByRenderId,
  loading,
  error,
  totalAiArticles,
  aiArticlesWithErrors,
  groupArticlesByAssetType,
  groupArticlesByAssetCategory,
} = useAiArticleData();

// Fetch AI articles for the render on component mount
/* onMounted(async () => {
    await fetchAiArticlesByRenderId(renderId);
}); */
</script>

<style scoped>
pre {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
}
</style>
