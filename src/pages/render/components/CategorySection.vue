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

        <!-- Slot for the category display -->
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
            :color="item.errors ? 'red' : 'green'"
            icon="mdi-alert-circle"
            :label="`${item.errors} Errors`"
          />
        </template>
      </v-data-table>
    </v-card>
  </v-card>
</template>

<script setup>
import { useRenderData } from "@/pages/render/composables/useRenderData";
import CustomChip from "@/components/primitives/chips/CustomChip.vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import CardHeader from "@/components/primitives/headers/CardHeader.vue";

// Use the composable to get the table data and other logic
const { search, filteredCategoryItems, getAssetCountColor } = useRenderData();

// Define the table headers
const headers = [
  { title: "", value: "category", align: "start", sortable: false },
  { title: "Assets", value: "assetCount", align: "center" },
  { title: "Articles", value: "articleCount", align: "center" },
  { title: "Errors", value: "errors", align: "center" },
  { title: "", value: "link", align: "end", sortable: false },
];
</script>

<style scoped>
.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}
</style>
