<template>
  <!-- Show Loading Spinner when there are no renders -->
  <LoadingSpinner v-if="loading" />
  <!-- Show Error Alert if there's an error -->
  <ErrorAlert v-else-if="error" :message="error" />
  <template v-else>
    <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md mt-4">
      <div class="text-body py-2 px-4">
        Season Bundles ({{ getAccountRenders?.length }})
      </div>
      <v-card class="pa-2 elevation-0 bg-surface rounded-md">
        <!-- Display the renders data in a data table when renders are available -->
        <v-data-table :headers="computedHeaders" :items="filteredRenders" class="mx-auto" fixed-header
          color="cardNeutral" variant="flat" rounded :sort-by="[{ key: 'id', order: 'desc' }]">
          <!-- Slot for the name -->
          <template v-slot:[`item.name`]="{ item }">
            <span v-if="item.Name" class="table-copy">{{ item.Name }}</span>
          </template>

          <!-- Modify the Complete status slot -->
          <template v-slot:[`item.Complete`]="{ item }">
            <v-icon :color="item.Complete ? 'success' : 'error'" v-if="$vuetify.display.smAndUp">
              {{ item.Complete ? icons.ui.tick : icons.ui.cross }} ...
            </v-icon>

          </template>

          <!-- Modify the Email Sent status slot -->
          <template v-slot:[`item.EmailSent`]="{ item }">
            <v-icon :color="item.EmailSent ? 'success' : 'error'" v-if="$vuetify.display.smAndUp">
              {{ item.EmailSent ? icons.ui.tick : icons.ui.cross }}
            </v-icon>
          </template>

          <!-- Slot for the created date -->
          <template v-slot:[`item.created`]="{ item }">
            <div class="table-copy">
              {{ item.created }}
            </div>
          </template>

          <!-- Add game results count -->
          <template v-slot:[`item.game_results_in_renders_count`]="{ item }">
            <div class="table-copy">
              {{ item.game_results_in_renders_count }}
            </div>
          </template>

          <!-- Add upcoming games count -->
          <template v-slot:[`item.upcoming_games_in_renders_count`]="{ item }">
            <div class="table-copy">
              {{ item.upcoming_games_in_renders_count }}
            </div>
          </template>

          <!-- Add grades count -->
          <template v-slot:[`item.grades_in_renders_count`]="{ item }">
            <div class="table-copy">
              {{ item.grades_in_renders_count }}
            </div>
          </template>

          <!-- Add downloads count -->
          <template v-slot:[`item.downloads_count`]="{ item }">
            <div class="table-copy">
              {{ item.downloads_count }}
            </div>
          </template>

          <!-- Add AI articles count -->
          <template v-slot:[`item.ai_articles_count`]="{ item }">
            <div class="table-copy">
              {{ item.ai_articles_count }}
            </div>
          </template>

          <!-- Slot for the action button -->
          <template v-slot:[`item.actions`]="{ item }">
            <div class="table-copy">
              <IconButton v-if="item.id" @click="viewRender(item.id)" color="accent"
                :icon="icons.navigation.internalLink" size="small" variant="tonal" />
            </div>
          </template>

          <!-- Search Toolbar -->
          <template #top>
            <v-toolbar flat class="px-4" color="secondary" rounded>
              <v-spacer></v-spacer>
              <v-text-field v-model="search" density="compact" label="Search" :prepend-inner-icon="icons.bundles.bundle"
                variant="solo-filled" flat hide-details single-line></v-text-field>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-card>
    </v-card>
  </template>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
const icons = inject("icons");
import LoadingSpinner from "@/components/UI/LoadingSpinner.vue";
import ErrorAlert from "@/components/UI/ErrorMessage.vue";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import { useDisplay } from "vuetify";
import { useAccountData } from "@/pages/account/composables/useAccountData";

// Vuetify display
const { mdAndUp, lgAndUp } = useDisplay();

// Initialize router and route
const router = useRouter();
const route = useRoute();

// Use composables for data
const { getAccountRenders, getAccountSport, loading, error } = useAccountData(); // Ensure this is a ref or computed value
// Search input state
const search = ref("");

// Define the full set of table headers with all items
const fullHeaders = [
  { title: "Bundles", key: "created", align: "start", sortable: true },

  {
    title: "Results",
    key: "game_results_in_renders_count",
    align: "center",
    sortable: true,
  },
  {
    title: "Upcoming",
    key: "upcoming_games_in_renders_count",
    align: "center",
    sortable: true,
  },
  {
    title: "Grades",
    key: "grades_in_renders_count",
    align: "center",
    sortable: true,
  },
  {
    title: "Downloads",
    key: "downloads_count",
    align: "center",
    sortable: true,
  },
  {
    title: "Articles",
    key: "ai_articles_count",
    align: "center",
    sortable: true,
  },
  { title: "Complete", key: "Complete", align: "center", sortable: false },
  { title: "Notified", key: "EmailSent", align: "center", sortable: false },
  { title: "", key: "actions", align: "end", sortable: false },
];

// Define headers for medium screens (sm and up to md)
const mediumHeaders = [
  { title: "Bundles", key: "created", align: "start", sortable: true },
  { title: "Complete", key: "Complete", align: "center", sortable: false },
  { title: "Notified", key: "EmailSent", align: "center", sortable: false },
  { title: "", key: "actions", align: "end", sortable: false },
];

// Define headers for extra small screens (xs)
const smallHeaders = [
  { title: "Bundles", key: "created", align: "start", sortable: true },
  { title: "", key: "actions", align: "end", sortable: false },
];

// Computed property to switch between headers based on screen size
const computedHeaders = computed(() => {
  if (lgAndUp.value) {
    return fullHeaders; // Use all headers for large screens
  } else if (mdAndUp.value) {
    return mediumHeaders; // Use reduced headers for medium screens
  } else {
    return smallHeaders; // Only show Name and actions for small screens
  }
});

// Fallback to an empty array if getAccountRenders is undefined or null
const renders = computed(() => getAccountRenders.value || []);

// Handle viewing the render (ensure the URL is constructed correctly)
function viewRender(renderId) {
  const accountId = route.params.accountid;
  router.push(
    `/${accountId}/${getAccountSport.value.toLowerCase()}/${renderId}`
  );
}

// Filtered renders based on the search input
const filteredRenders = computed(() => {
  if (search.value) {
    return renders.value.filter((item) =>
      item.Name.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  return renders.value;
});
</script>
