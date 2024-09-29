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
              :to="getCategoryLink(item.type)"
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
import { useGroupedAssetsData } from "@/pages/grouping/composables/useGroupedAssetsData";
import IconButton from "@/components/primitives/buttons/IconButton.vue";

const route = useRoute();

// Search bar state
const search = ref("");

// Reactive route parameters
const groupingCategory = ref(route.params.groupingcategory || "");

// Fetching data from the composable
let { loading, getAssetTypeWithIds } = useGroupedAssetsData(
  groupingCategory.value,
  route.params.renderid
);

// Define the table headers
const headers = [
  { title: "Asset Type", value: "type", align: "start" },
  { title: "Downloads", value: "downloads", align: "center" },
  { title: "Articles", value: "aiArticles", align: "center" },
  { title: "", value: "link", align: "end", sortable: false },
];

// Prepare the data for the table
const items = computed(() => {
  return (
    getAssetTypeWithIds.value.map((item) => ({
      type: item.type,
      downloadCount: item.downloads.length,
      articleCount: item.aiArticles.length,
      link: getCategoryLink(item.type),
    })) || []
  );
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

// Function to return a display name for the type
function getDisplayName(type) {
  const names = {
    WeekendResults: "Weekend Results",
    Ladder: "Ladder",
    Top5BowlingList: "Top 5 Bowling",
    Top5BattingList: "Top 5 Batting",
    UpComingFixtures: "Upcoming Fixtures",
    WeekendSingleGameResult: "Single Game Result",
    RosterPoster: "Roster Poster",
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
    RosterPoster: "mdi-account-group",
  };
  return icons[type] || "mdi-file";
}

// Watch for changes in the route parameters and refetch data
watch(
  () => route.params.groupingcategory,
  (newCategory) => {
    groupingCategory.value = newCategory;
    const groupedData = useGroupedAssetsData(
      groupingCategory.value,
      route.params.renderid
    );
    loading = groupedData.loading;
  }
);
</script>
