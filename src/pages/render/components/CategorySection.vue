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
        :headers="computedHeaders"
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
              :prepend-inner-icon="icons.bundles.bundleDate"
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
            :icon="icons.navigation.internalLink"
            size="small"
            variant="tonal"
          />
        </template>

        <!-- Slot for the category display -->
        <template v-slot:[`item.category`]="{ item }">
          <div class="table-copy text-bold">{{ item.category }}</div>
        </template>

        <!-- Conditionally render asset count based on screen size -->
        <template
          v-if="$vuetify.display.mdAndUp"
          v-slot:[`item.assetCount`]="{ item }"
        >
          <CustomChip
            :color="getAssetCountColor(item.assetCount)"
            :icon="icons.assets.download"
            :label="`${item.assetCount} Assets`"
            size="small"
          />
        </template>

        <!-- Conditionally render article count based on screen size -->
        <template
          v-if="$vuetify.display.mdAndUp"
          v-slot:[`item.articleCount`]="{ item }"
        >
          <CustomChip
            :color="getAssetCountColor(item.articleCount)"
            :icon="icons.assets.articles"
            :label="`${item.articleCount} Articles`"
            size="small"
          />
        </template>

        <!-- Slot for the error count display -->
        <template
          v-if="$vuetify.display.lgAndUp"
          v-slot:[`item.errors`]="{ item }"
        >
          <CustomChip
            :color="item.errors ? 'red' : 'green'"
            :icon="icons.ui.error"
            :label="`${item.errors} Errors`"
            size="small"
          />
        </template>
      </v-data-table>
    </v-card>
  </v-card>
</template>

<script setup>
import { computed, inject } from "vue";
import { useDisplay } from "vuetify";
const icons = inject("icons");

import { useRenderData } from "@/pages/render/composables/useRenderData";
import CustomChip from "@/components/primitives/chips/CustomChip.vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import CardHeader from "@/components/primitives/headers/CardHeader.vue";

const { mdAndUp, lgAndUp } = useDisplay();

// Use the composable to get the table data and other logic
const { search, filteredCategoryItems, getAssetCountColor } = useRenderData();

// Define the full set of table headers with all items
const fullHeaders = [
  { title: "", value: "category", align: "start", sortable: false },
  { title: "Assets", value: "assetCount", align: "center" },
  { title: "Articles", value: "articleCount", align: "center" },
  { title: "Errors", value: "errors", align: "center" },
  { title: "", value: "link", align: "end", sortable: false },
];

// Define headers for medium screens (sm and up to md)
const mediumHeaders = [
  { title: "", value: "category", align: "start", sortable: false },
  { title: "Assets", value: "assetCount", align: "center" },
  { title: "Articles", value: "articleCount", align: "center" },
  { title: "", value: "link", align: "end", sortable: false },
];

// Define headers for extra small screens (xs)
const smallHeaders = [
  { title: "", value: "category", align: "start", sortable: false },
  { title: "", value: "link", align: "end", sortable: false },
];

// Computed property to switch between headers based on screen size
const computedHeaders = computed(() => {
  if (lgAndUp.value) {
    return fullHeaders; // Use all headers for large screens
  } else if (mdAndUp.value) {
    return mediumHeaders; // Use reduced headers for medium screens
  } else {
    return smallHeaders; // Only show category and actions for small screens
  }
});
</script>

<style scoped>
.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}
</style>
