<template>
  <!-- Show Skeleton Loader when loading -->
  <v-skeleton-loader v-if="loading" type="table" />

  <template v-else>
    <!-- Display the download stats in a data table when data is loaded -->
    <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md mt-4">
      <div class="text-body py-2 px-4"></div>
      <v-card class="pa-2 elevation-0 bg-surface rounded-md">
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          class="mx-auto"
          fixed-header
          color="cardNeutral"
          variant="flat"
          rounded
        >
          <!-- Slot for the asset type display (with icon and name) -->
          <template v-slot:[`item.type`]="{ item }">
            <v-icon :icon="getIcon(item.type)" class="mr-2" />
            {{ getDisplayName(item.type) }}
          </template>

          <!-- Slot for the download and article count display -->
          <template v-slot:[`item.downloads`]="{ item }">
            <CustomChip
              :color="getAssetCountColor(item.downloadCount)"
              :label="`${item.downloadCount} Downloads`"
            />
          </template>

          <template v-slot:[`item.aiArticles`]="{ item }">
            <CustomChip
              :color="getAssetCountColor(item.articleCount)"
              :label="`${item.articleCount} Articles`"
            />
          </template>

          <!-- Slot for the Action button -->
          <template v-slot:[`item.link`]="{ item }">
            <IconButton
              :to="item.link"
              color="accent"
              icon="mdi-arrow-right"
              size="small"
              variant="tonal"
            />
          </template>
        </v-data-table>
      </v-card>
    </v-card>
  </template>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import CustomChip from "@/components/primitives/chips/CustomChip.vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import { useRenderGroupingData } from "@/pages/grouping/composables/useRenderGroupingData";

// Fetch data from the composable
const { loading, getAssetsByType } = useRenderGroupingData();
const route = useRoute();

// Search bar state
const search = ref("");
const groupingCategory = ref(route.params.groupingcategory);
// Define the table headers
const headers = [
  { title: "Asset Type", value: "type", align: "start" },
  { title: "Downloads", value: "downloads", align: "center" },
  { title: "Articles", value: "aiArticles", align: "center" },
  { title: "", value: "link", align: "end", sortable: false },
];

// Define a custom order for the asset types
const assetOrder = [
  "WeekendResults",
  "WeekendSingleGameResult",
  "Top5BattingList",
  "Top5BowlingList",
  "Ladder",
  "UpComingFixtures",
];

// Prepare the data for the table
const items = computed(() => {
  const sortedItems = Object.entries(getAssetsByType.value)
    .map(([type, stats]) => ({
      type,
      downloadCount: stats.downloads,
      articleCount: stats.aiArticles,
      link: getCategoryLink(type),
    }))
    .sort((a, b) => assetOrder.indexOf(a.type) - assetOrder.indexOf(b.type)); // Sort based on custom order

  return sortedItems;
});

// Filter the data based on search input
const filteredItems = computed(() => {
  return items.value.filter((item) =>
    item.type.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Function to generate the link to the asset type's page
function getCategoryLink(type) {
  const accountId = Number(route.params.accountid);
  const sport = route.params.sport;
  const renderId = Number(route.params.renderid);
  return `/${accountId}/${sport}/${renderId}/${
    groupingCategory.value
  }/${type.toLowerCase()}`;
}

// Function to return a display name for the type (enum guide)
function getDisplayName(type) {
  const names = {
    WeekendResults: "Weekend Results",
    Ladder: "Ladder",
    Top5BowlingList: "Top 5 Bowling",
    Top5BattingList: "Top 5 Batting",
    UpComingFixtures: "Upcoming Fixtures",
    WeekendSingleGameResult: "Single Game Result",
  };
  return names[type] || type;
}

// Function to determine chip color based on asset count
function getAssetCountColor(count) {
  if (count > 100) return "red";
  else if (count > 50) return "orange";
  else return "green";
}

// Function to return the correct icon based on the type
function getIcon(type) {
  const icons = {
    WeekendResults: "mdi-calendar-check",
    Ladder: "mdi-trophy",
    Top5BowlingList: "mdi-bowling",
    Top5BattingList: "mdi-baseball-bat",
    UpComingFixtures: "mdi-calendar-multiple",
    WeekendSingleGameResult: "mdi-calendar-weekend",
  };
  return icons[type] || "mdi-file";
}

watch(
  () => route.params,
  (newParams) => {
    groupingCategory.value = newParams.groupingcategory;
  }
);
</script>
