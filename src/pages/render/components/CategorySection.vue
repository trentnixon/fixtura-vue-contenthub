<template>
  <div class="text-body py-1 px-2 mt-4">
    <CardHeader
      title="Categories"
      subtitle="Click a category to view the assets and articles"
    />
  </div>
  <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md">
    <v-card class="pa-2 elevation-0 bg-surface rounded-md">
      <v-data-table
        :headers="headers"
        :items="filteredCategoryItems"
        class="mx-auto"
        fixed-header
        color="cardNeutral"
        variant="outlined"
        rounded
      >
        <template #top>
          <v-toolbar flat class="px-4" color="secondary" rounded>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              density="compact"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              flat
              hide-details
              single-line
            ></v-text-field>
          </v-toolbar>
        </template>

        <!-- Slot for the Action button -->
        <template v-slot:[`item.link`]="{ item }">
          <IconButton
            :to="item.link"
            color="accent"
            icon="mdi-arrow-right"
            size="small"
            variant="flat"
          />
        </template>

        <template v-slot:[`item.category`]="{ item }">
          <div class="table-copy text-bold">{{ item.category }}</div>
        </template>

        <!-- Slot for the asset count display -->
        <template v-slot:[`item.assetCount`]="{ item }">
          <CustomChip
            :color="getAssetCountColor(item.assetCount)"
            icon="mdi-home"
            :label="`${item.assetCount} Assets`"
          />
        </template>

        <!-- Slot for the article count display -->
        <template v-slot:[`item.articleCount`]="{ item }">
          <CustomChip
            :color="getAssetCountColor(item.articleCount)"
            icon="mdi-file-document"
            :label="`${item.articleCount} Articles`"
          />
        </template>

        <!-- Slot for the error count display -->
        <template v-slot:[`item.errors`]="{ item }">
          <CustomChip
            :color="item.errors > 0 ? 'red' : 'green'"
            icon="mdi-alert-circle"
            :label="`${item.errors} Errors`"
          />
        </template>
      </v-data-table>
    </v-card>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useDownloadData } from "@/pages/render/composables/useDownloadData";
import { useAiArticleData } from "@/pages/render/composables/useAiArticleData";
import CustomChip from "@/components/primitives/chips/CustomChip.vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import CardHeader from "@/components/primitives/headers/CardHeader.vue";
const route = useRoute();
// State for search input
const search = ref("");

// Extract the necessary data from the composable
const { downloadStats } = useDownloadData();
const { aiArticlesWithErrorsByCategory, getAiArticleCountByGroupingCategory } =
  useAiArticleData();
const categories = computed(() => downloadStats.value.groupingCategories);
// Fetch AI article data

// Define the table headers
//{ title: "", value: "category", align: "start" },
const headers = [
  { title: "", value: "category", align: "start", sortable: false },
  { title: "Assets", value: "assetCount", align: "center" },
  { title: "Articles", value: "articleCount", align: "center" },
  { title: "Errors", value: "errors", align: "center" },
  { title: "", value: "link", align: "end", sortable: false },
];

// Prepare the data for the table
const categoryItems = computed(() => {
  return categories.value.map((category) => {
    return {
      category,
      assetCount: getAssetCount(category) || 0,
      articleCount: getAiArticleCountByGroupingCategory.value[category] || 0, // Use the new method
      errors: aiArticlesWithErrorsByCategory.value[category] || 0, // Use the new computed value
      link: getCategoryLink(category),
    };
  });
});

// Filter the data based on search input
const filteredCategoryItems = computed(() => {
  return categoryItems.value.filter((item) =>
    item.category.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Function to generate the link to the category's page
function getCategoryLink(category) {
  const accountId = Number(route.params.accountid); // Replace with dynamic value if needed
  const sport = route.params.sport; // Replace with dynamic value if needed
  const renderId = Number(route.params.renderid); // Replace with dynamic value if needed
  return `/${accountId}/${sport}/${renderId}/${category.toLowerCase()}`;
}

// Function to get asset count
function getAssetCount(category) {
  const categoryStat = downloadStats.value.groupingCategory[category];
  return categoryStat ? categoryStat : 0;
}

// Function to determine chip color based on asset count
function getAssetCountColor(count) {
  if (count > 100) return "red";
  else if (count > 50) return "orange";
  else return "green";
}
</script>

<style scoped>
.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}
</style>
