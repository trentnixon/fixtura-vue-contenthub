<template>
  <v-container fluid class="pa-0">
    <h1>Download Debug Information</h1>

    <v-alert v-if="error" type="error" class="mt-4">
      Error: {{ error }}
    </v-alert>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="mt-4"
    ></v-progress-circular>

    <div v-if="downloadsByRender && !loading" class="mt-4">
      <v-expansion-panels flat>
        <!-- Total Downloads -->
        <v-expansion-panel>
          <v-expansion-panel-title color="primary"
            >Total Downloads</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <p>Total Downloads: {{ getTotalDownloads }}</p>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Digital Asset Links -->
        <v-expansion-panel>
          <v-expansion-panel-title color="secondary"
            >Digital Asset Links</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <ul>
              <li v-for="url in getDigitalAssetLinks" :key="url">
                <a :href="url" target="_blank">{{ url }}</a>
              </li>
            </ul>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Grouped by Asset Type -->
        <v-expansion-panel>
          <v-expansion-panel-title color="primary"
            >Grouped by Asset Type</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <div
              v-for="(downloads, type) in getDownloadsGroupedByType"
              :key="type"
            >
              <h3>{{ type }}</h3>
              <ul>
                <li v-for="download in downloads" :key="download.id">
                  {{ download.attributes.Name }}
                </li>
              </ul>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Grouped by Asset Category -->
        <v-expansion-panel>
          <v-expansion-panel-title color="secondary"
            >Grouped by Asset Category</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <div
              v-for="(downloads, category) in getDownloadsGroupedByCategory"
              :key="category"
            >
              <h3>{{ category }}</h3>
              <ul>
                <li v-for="download in downloads" :key="download.id">
                  {{ download.attributes.Name }}
                </li>
              </ul>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Grouping Category -->
        <v-expansion-panel>
          <v-expansion-panel-title color="primary"
            >Grouping Category</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <ul>
              <li v-for="category in getGroupingCategory" :key="category">
                {{ category }}
              </li>
            </ul>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Raw Download Data -->
        <v-expansion-panel>
          <v-expansion-panel-title color="secondary"
            >Raw Download Data</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <pre>{{ downloadsByRender }}</pre>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDownloadData } from "@/pages/render/composables/OLD_useDownloadData";

const route = useRoute();
const renderId = Number(route.params.renderid);

const {
  downloadsByRender,
  fetchDownloadsByRenderId,
  loading,
  error,
  getTotalDownloads,
  getDigitalAssetLinks,
  getDownloadsGroupedByType,
  getDownloadsGroupedByCategory,
  getGroupingCategory,
} = useDownloadData();

/*  onMounted(async () => {
    await fetchDownloadsByRenderId(renderId);
  }); */
</script>

<style scoped>
pre {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
}
</style>
