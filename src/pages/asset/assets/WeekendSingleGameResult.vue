<template>
  <v-container class="pa-0" fluid>
    <!-- Fixtures Table View -->
    <template v-if="selectedFixtureIndex === null">
      <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md mt-4">
        <v-card class="pa-2 elevation-0 bg-surface rounded-md">
          <v-data-table
            :headers="headers"
            :items="filteredFixtures"
            :items-per-page="itemsPerPage"
            @update:items-per-page="onItemsPerPageChange"
            v-model:page="currentPage"
            class="elevation-0 mx-auto"
            hover
          >
            <!-- Search Bar -->
            <template #top>
              <v-toolbar flat class="px-4" color="secondary" rounded>
                <div class="text-leading">Fixtures</div>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  density="compact"
                  label="Search Teams"
                  prepend-inner-icon="mdi-magnify"
                  variant="solo-filled"
                  flat
                  hide-details
                  single-line
                ></v-text-field>
              </v-toolbar>
            </template>

            <!-- Avatar Column -->
            <template v-slot:[`item.avatar`]="{ item }">
              <v-img
                :width="50"
                aspect-ratio="16/9"
                cover
                :src="item.avatar"
              ></v-img>
            </template>
            <template v-slot:[`item.teams`]="{ item }">
              <div class="table-copy text-bold d-block text-truncate">
                {{ item.teams }}
              </div>
              <div class="table-copy d-block text-truncate">
                {{ item.scores }}
              </div>
            </template>

            <!-- Action Column -->
            <template v-slot:[`item.action`]="{ item }">
              <IconButton
                @click="selectFixture(item.id)"
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

    <!-- Detailed View -->
    <template v-else>
      <!-- Back Button -->
      <div class="d-flex justify-end mb-0">
        <SecondaryButton
          label="Back"
          icon="mdi-arrow-left"
          @click="backToList"
        />
      </div>

      <v-divider class="my-2 py-0 px-4" />
      <v-row>
        <v-col cols="12" md="5">
          <!-- Image Gallery -->
          <AssetImageGallery
            v-if="selectedImage"
            :imageUrls="[selectedImage]"
            isSingleImage="true"
          />
        </v-col>
        <v-col class="d-flex justify-start" cols="12" md="7">
          <!-- Article Content -->
          <AssetDisplayArticle
            v-if="selectedArticle"
            :articles="[selectedArticle]"
          />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, defineProps, computed } from "vue";
import AssetImageGallery from "./media/AssetImageGallery.vue";
import AssetDisplayArticle from "./media/AssetDisplayArticle.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
// Define component props
const props = defineProps({
  formattedAssets: Array, // Images related to the fixtures
  formattedArticles: Array, // Articles related to the fixtures
});

// State for search input
const search = ref("");
const currentPage = ref(1); // Default to page 1
const itemsPerPage = ref(5); // Default to 5 items per page

// Define table headers
const headers = [
  { title: "", value: "avatar", sortable: false, align: "center" },
  { title: "", value: "teams", align: "start" },
  { title: "", value: "action", sortable: false, align: "end" },
];

// Prepare fixtures data for the table
const fixtures = computed(() => {
  //console.log("[props.formattedAssets]", props.formattedAssets[0].downloads);
  return props.formattedArticles.map((article, index) => ({
    id: index,
    teams: `${article.structuredOutput.team1} vs ${article.structuredOutput.team2}`,
    scores: `${article.structuredOutput.score1} | ${article.structuredOutput.score2}`,
    avatar: props.formattedAssets[0].downloads[index],
  }));
});

console.log("[fixtures]", fixtures);

// Filtered fixtures based on search input
const filteredFixtures = computed(() => {
  if (!search.value) return fixtures.value;
  return fixtures.value.filter((fixture) =>
    fixture.teams.toLowerCase().includes(search.value.toLowerCase())
  );
});

// State for selected fixture index
const selectedFixtureIndex = ref(null);

// Computed properties for selected article and image
const selectedArticle = computed(() => {
  return selectedFixtureIndex.value !== null
    ? props.formattedArticles[selectedFixtureIndex.value]
    : null;
});

const selectedImage = computed(() => {
  if (
    selectedFixtureIndex.value !== null &&
    props.formattedAssets[0] &&
    props.formattedAssets[0].downloads.length > 0
  ) {
    // Assuming you want the first image in the downloads array
    return (
      props.formattedAssets[0].downloads[selectedFixtureIndex.value] ||
      props.formattedAssets[0].downloads[0]
    );
  }
  return null; // Handle undefined or empty array
});
const onItemsPerPageChange = (newItemsPerPage) => {
  itemsPerPage.value = newItemsPerPage;
};

// Function to select a fixture and show details
const selectFixture = (id) => {
  selectedFixtureIndex.value = id;
};
// Function to go back to the fixtures table
const backToList = () => {
  selectedFixtureIndex.value = null;
};
</script>

<style scoped>
/* You can add any custom styling here */
</style>
