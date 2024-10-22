<template>
  <!-- Show Skeleton Loader when loading -->
  <v-skeleton-loader v-if="loading" type="table" />

  <template v-else>
    <v-row class="mx-0">
      <v-col class="d-flex justify-end py-0 px-2 align-center" cols="12">
        <CustomChip
          :label="
            !getSelectedCategoryStats?.hasErrors
              ? 'No Errors Detected'
              : 'Errors'
          "
          :value="!getSelectedCategoryStats?.hasErrors"
          type="boolean"
        />
        <template v-if="getAccountType === 1">
          <PrimaryButton
            label="Team Rosters"
            size="small"
            :to="rosterLink"
            color="accent"
          />
        </template>
      </v-col>
    </v-row>

    <!-- Display the download stats in a data table when data is loaded -->
    <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md mt-2">
      <div class="text-body py-2 px-4"></div>
      <v-card class="pa-2 elevation-0 bg-surface rounded-md">
        <v-data-table
          :headers="computedHeaders"
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

          <!-- Conditionally render download count based on screen size -->
          <template
            v-if="$vuetify.display.mdAndUp"
            v-slot:[`item.downloads`]="{ item }"
          >
            <CustomChip
              :color="getAssetCountColor(item.downloadCount)"
              :label="`${item.downloadCount} Downloads`"
              :icon="icons.assets.download"
            />
          </template>

          <!-- Conditionally render article count based on screen size -->
          <template
            v-if="$vuetify.display.mdAndUp"
            v-slot:[`item.aiArticles`]="{ item }"
          >
            <CustomChip
              :color="getAssetCountColor(item.articleCount)"
              :label="`${item.articleCount} Articles`"
              :icon="icons.assets.file"
            />
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
        </v-data-table>
      </v-card>
    </v-card>
  </template>
</template>

<script setup>
import { ref, computed, watch, inject } from "vue";
import { useRoute } from "vue-router";
import CustomChip from "@/components/primitives/chips/CustomChip.vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import { useRenderGroupingData } from "@/pages/grouping/composables/useRenderGroupingData";
import { useDisplay } from "vuetify";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import { useAccountData } from "@/pages/account/composables/useAccountData";

const icons = inject("icons");
const { mdAndUp } = useDisplay();
const { getAccountType } = useAccountData();
// Fetch data from the composable
const { loading, getAssetsByType, getSelectedCategoryStats } =
  useRenderGroupingData();
const route = useRoute();

// Search bar state
const search = ref("");
const groupingCategory = ref(route.params.groupingcategory);

// Define the full set of table headers with all items
const fullHeaders = [
  { title: "Asset Type", value: "type", align: "start" },
  { title: "Downloads", value: "downloads", align: "center" },
  { title: "Articles", value: "aiArticles", align: "center" },
  { title: "", value: "link", align: "end", sortable: false },
];

// Define headers for extra small screens (xs)
const smallHeaders = [
  { title: "Asset Type", value: "type", align: "start" },
  { title: "", value: "link", align: "end", sortable: false },
];

// Computed property to switch between headers based on screen size
const computedHeaders = computed(() => {
  if (mdAndUp.value) {
    return fullHeaders; // Use all headers for large screens
  } else {
    return smallHeaders; // Only show type and actions for small screens
  }
});

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

  // Encode the grouping category to escape special characters
  const encodedGroupingCategory = encodeURIComponent(
    groupingCategory.value
  ).replace(/\//g, "%2F");

  return `/${accountId}/${sport}/${renderId}/${encodedGroupingCategory}/${type.toLowerCase()}`;
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
    RosterPoster: "Team Rosters",
  };
  return names[type] || type;
}

// Function to determine chip color based on asset count
function getAssetCountColor(count) {
  if (count > 100) return "red";
  else if (count > 50) return "orange";
  else return "green";
}

function getIcon(type) {
  const iconMap = {
    WeekendResults: icons.categories.results,
    Ladder: icons.categories.ladder,
    Top5BowlingList: icons.categories.bowling,
    Top5BattingList: icons.categories.batting,
    UpComingFixtures: icons.categories.upcoming,
    WeekendSingleGameResult: icons.categories.singleResult,
    RosterPoster: icons.categories.roster,
  };
  return iconMap[type] || icons.file;
}

// team roaster handler
const rosterLink = computed(() => {
  // vue link to  renderId/cricket/6852/senior/rosterposter
  const accountId = Number(route.params.accountid);
  const sport = route.params.sport;
  const renderId = Number(route.params.renderid);
  return `/${accountId}/${sport}/${renderId}/${groupingCategory.value}/rosterposter`;
});

watch(
  () => route.params,
  (newParams) => {
    groupingCategory.value = newParams.groupingcategory;
  }
);
</script>
