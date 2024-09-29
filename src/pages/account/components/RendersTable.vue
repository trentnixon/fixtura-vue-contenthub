<template>
  <!-- Show Loading Spinner when there are no renders -->
  <LoadingSpinner v-if="renders.length === 0" />

  <!-- Show Error Alert if there's an error -->
  <ErrorAlert v-else-if="error" :message="error" />
  <template v-else>
    <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md mt-4">
      <div class="text-body py-2 px-4">{{ renders.length }} Season Bundles</div>
      <v-card class="pa-2 elevation-0 bg-surface rounded-md">
        <!-- Display the renders data in a data table when renders are available -->
        <v-data-table
          :headers="responsiveHeaders"
          :items="filteredRenders"
          class="mx-auto"
          fixed-header
          color="cardNeutral"
          variant="flat"
          rounded
          :sort-by="[{ key: 'id', order: 'desc' }]"
        >
          <!-- Slot for the name -->
          <template v-slot:[`item.name`]="{ item }">
            <span v-if="item.name" class="table-copy">{{ item.name }}</span>
          </template>

          <!-- Modify the Complete status slot -->
          <template v-slot:[`item.complete`]="{ item }">
            <v-icon
              :color="item.complete ? 'success' : 'error'"
              v-if="$vuetify.display.smAndUp"
            >
              {{ item.complete ? "mdi-check-circle" : "mdi-close-circle" }}
            </v-icon>
          </template>

          <!-- Modify the Email Sent status slot -->
          <template v-slot:[`item.emailSent`]="{ item }">
            <v-icon
              :color="item.emailSent ? 'success' : 'error'"
              v-if="$vuetify.display.smAndUp"
            >
              {{ item.emailSent ? "mdi-check-circle" : "mdi-close-circle" }}
            </v-icon>
          </template>

          <!-- Slot for the action button -->
          <template v-slot:[`item.updatedAt`]="{ item }">
            <div class="table-copy">
              {{ formatDate(item.updatedAt) }}
            </div>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div class="table-copy">
              <IconButton
                v-if="item.id"
                @click="viewRender(item.id)"
                color="accent"
                icon="mdi-arrow-right"
                size="small"
                variant="tonal"
              />
            </div>
          </template>

          <!-- Search Toolbar -->
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
        </v-data-table>
      </v-card>
    </v-card>
  </template>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import { format } from "date-fns";
import { useRouter, useRoute } from "vue-router";
import LoadingSpinner from "@/components/UI/LoadingSpinner.vue";
import ErrorAlert from "@/components/UI/ErrorMessage.vue";
import { useAccountData } from "@/pages/account/composables/useAccountData";
import { useSchedulerData } from "@/pages/account/composables/useSchedulerData";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import { useDisplay } from "vuetify";

const { smAndUp } = useDisplay();
// Initialize router and route
const router = useRouter();
const route = useRoute();

// Use composables for data
const { getSchedulerID, getAccountSport } = useAccountData();
const { fetchSchedulerById, renders, loading, error } = useSchedulerData();

// Search input state
const search = ref("");

// Define the table headers with "Updated At", "Name", "Email Sent", and "Actions"
const headers = [
  { title: "Bundles", key: "updatedAt", align: "start", sortable: true },
  { title: "Complete", key: "complete", align: "end", sortable: false },
  { title: "Notified", key: "emailSent", align: "end", sortable: false },
  { title: "", key: "actions", align: "end", sortable: false },
];
// Add a new computed property for responsive headers
const responsiveHeaders = computed(() => {
  if (smAndUp.value) {
    return headers;
  } else {
    return headers.filter(
      (header) => !["complete", "emailSent"].includes(header.key)
    );
  }
});
// Function to format the date
function formatDate(dateStr) {
  return format(new Date(dateStr), "EEE do MMM yyyy");
}

// Handle viewing the render (ensure the URL is constructed correctly)
function viewRender(renderId) {
  const accountId = route.params.accountid;
  router.push(
    `/${accountId}/${getAccountSport.value.toLowerCase()}/${renderId}`
  );
}

// Prepare the data for the table
const items = computed(() => {
  return renders.value.map((item) => ({
    id: item.id, // Add the id for the button action
    updatedAt: item.attributes?.updatedAt, // Defensive check for updatedAt
    name: item.attributes?.Name, // Add name from the attributes
    complete: item.attributes?.Complete, // Defensive check for complete status
    emailSent: item.attributes?.EmailSent, // Add email status from attributes
  }));
});

// Filtered renders based on the search input
const filteredRenders = computed(() => {
  if (search.value) {
    return items.value.filter((item) =>
      item.name?.toLowerCase().includes(search.value.toLowerCase())
    );
  }
  return items.value;
});

// Watch for changes in scheduler ID and fetch renders when it changes
watch(
  () => getSchedulerID.value,
  async (schedulerId) => {
    if (schedulerId) {
      try {
        console.log("Fetching renders for scheduler:", schedulerId);
        await fetchSchedulerById(schedulerId);
      } catch (err) {
        console.error("Failed to fetch scheduler renders:", err);
      }
    }
  },
  { immediate: true } // This ensures the fetch happens immediately when the component is mounted
);

// Watch for updates to the renders and log them for debugging
watch(
  () => renders.value,
  (newVal) => {
    console.log("[RendersTable] Renders updated:", newVal);
  }
);

// Watch for loading changes and log them for debugging
watch(
  () => loading.value,
  (newVal) => {
    console.log("[Loading] Loading updated:", newVal);
  }
);
</script>
