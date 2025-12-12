<template>
  <v-container fluid class="pa-0">
    <HeaderSection />
    <AnnouncementBanner :enabled="showAnnouncementBanner"
      title="We're aware of a fixture date error affecting certain grades and are working to resolve it promptly."
      message="This bug may cause some renders to display past fixtures in your bundles — if you've been affected, please use the &quot;Request a Re-Render&quot; button." />
    <v-alert v-if="getRerenderRequested" type="success" variant="tonal" class="mx-4 mt-4" prominent>
      <template v-slot:prepend>
        <v-icon>mdi-check-circle</v-icon>
      </template>
      <div class="d-flex align-center">
        <span class="font-weight-medium">Rerender Requested</span>
        <v-spacer />
        <span class="text-caption">We have received your rerender request and will review it shortly.</span>
      </div>
    </v-alert>
    <v-divider class="my-4" />

    <CategorySection />
    <v-row class="px-4 mt-2" v-if="!getRerenderRequested">
      <v-col class="d-flex justify-end">
        <PrimaryButton label="Request a Rerender" @click="handleRerender" color="primary" />
      </v-col>
    </v-row>
    <v-divider class="my-4 py-4" />
    <CardHeader title="The Numbers" subtitle="This weeks Bundle status" />
    <DownloadsStats />
    <!--     <AssetCategoryStats /> -->
    <v-divider class="my-4 py-4" />
    <CardHeader title="Fixture Statistics" subtitle="Overview of your bundle's fixtures and results" />
    <FixtureStats />
    <v-divider class="my-4 py-4" />

    <!-- Rerender Dialog -->
    <v-dialog v-model="showRerenderDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          Request a Rerender
        </v-card-title>
        <v-card-text v-if="!showSuccessMessage">
          <p class="mb-4">To request a rerender of this bundle please let us know what was wrong with this addition.</p>
          <v-select v-model="selectedRerenderReason" :items="rerenderReasons" label="Select reason" variant="outlined"
            :menu-props="{ maxHeight: '200' }" :disabled="isSubmitting" class="mb-4" />
          <v-text-field v-model="userEmail" label="Your Email" type="email" variant="outlined" :disabled="isSubmitting"
            :error-messages="emailError" required />
          <v-textarea v-model="additionalNotes" label="Additional Notes (Optional)" variant="outlined"
            :disabled="isSubmitting" rows="3" class="mt-2" />
          <v-alert v-if="submitError" type="error" class="mt-4" dismissible>
            {{ submitError }}
          </v-alert>
        </v-card-text>
        <v-card-text v-else>
          <p class="mb-2">Your request has been sent to us, we will review and contact you with a new render or
            clarification shortly.</p>
          <p class="text-right font-weight-medium">Fixtura team</p>
        </v-card-text>
        <v-card-actions v-if="!showSuccessMessage">
          <v-spacer />
          <SecondaryButton label="Cancel" @click="closeRerenderDialog" />
          <PrimaryButton label="Confirm" @click="confirmRerender" color="primary"
            :disabled="!isFormValid || isSubmitting" :loading="isSubmitting" />
        </v-card-actions>
        <v-card-actions v-else>
          <v-spacer />
          <PrimaryButton label="Close" @click="closeRerenderDialog" color="primary" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";

import HeaderSection from "@/pages/render/components/HeaderSection.vue";
import DownloadsStats from "@/pages/render/components/DownloadsStats.vue";
import CategorySection from "@/pages/render/components/CategorySection.vue";
import CardHeader from "@/components/primitives/headers/CardHeader.vue";
import FixtureStats from "@/pages/render/components/FixtureStats.vue";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import SecondaryButton from "@/components/primitives/buttons/SecondaryButton.vue";
import AnnouncementBanner from "@/components/UI/AnnouncementBanner.vue";
import { useAccountData } from "@/pages/account/composables/useAccountData";
import { fetchFixturaRenderById, submitRerenderRequestAction } from "@/store/renders/actions";
import { useRenderData } from "@/pages/render/composables/useRenderData";

// Initialize account and render fetching
const { fetchAccountById } = useAccountData();
const { getRerenderRequested } = useRenderData();

// Reactive route parameters
const route = useRoute();
const renderId = ref(Number(route.params.renderid));
const accountId = ref(Number(route.params.accountid));

// Announcement banner state
const showAnnouncementBanner = ref(false);

// Dialog state
const showRerenderDialog = ref(false);
const selectedRerenderReason = ref(null);
const showSuccessMessage = ref(false);
const userEmail = ref("");
const additionalNotes = ref("");
const isSubmitting = ref(false);
const submitError = ref("");

// Map frontend reason values to backend enum values
const reasonMap = {
  incorrect_data: "Incorrect Data",
  missing_fixtures: "Missing Content",
  wrong_team_info: "Incorrect Data", // Map to closest match
  formatting_issues: "Formatting Issue",
  other: "Other",
};

// Rerender reason options (will be replaced with enums later)
const rerenderReasons = [
  { title: "Incorrect data or statistics", value: "incorrect_data" },
  { title: "Missing fixtures or results", value: "missing_fixtures" },
  { title: "Wrong team or player information", value: "wrong_team_info" },
  { title: "Formatting or display issues", value: "formatting_issues" },
  { title: "Other issue", value: "other" },
];

// Email validation
const emailError = computed(() => {
  if (!userEmail.value) return "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(userEmail.value) ? "" : "Please enter a valid email address";
});

// Form validation
const isFormValid = computed(() => {
  return (
    selectedRerenderReason.value &&
    userEmail.value.trim() !== "" &&
    !emailError.value
  );
});

// Function to fetch the necessary data
async function fetchData() {
  await fetchAccountById(accountId.value);
  await fetchFixturaRenderById(accountId.value, renderId.value);
}

// Fetch data on component mount
onMounted(() => {
  fetchData();
});

// Watch for route parameter changes and refetch data
watch(
  () => route.params,
  (newParams) => {
    accountId.value = Number(newParams.accountid);
    renderId.value = Number(newParams.renderid);
    fetchData(); // Trigger refetch when route parameters change
  }
);

// Handle rerender button click
function handleRerender() {
  showRerenderDialog.value = true;
}

// Close dialog
function closeRerenderDialog() {
  showRerenderDialog.value = false;
  selectedRerenderReason.value = null;
  userEmail.value = "";
  additionalNotes.value = "";
  showSuccessMessage.value = false;
  submitError.value = "";
  isSubmitting.value = false;
}

// Confirm rerender
async function confirmRerender() {
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  submitError.value = "";

  try {
    // Map the reason value to backend enum format
    const backendReason = reasonMap[selectedRerenderReason.value] || "Other";

    const payload = {
      accountId: accountId.value,
      renderId: renderId.value,
      reason: backendReason,
      userEmail: userEmail.value.trim(),
      additionalNotes: additionalNotes.value.trim() || undefined,
      userMeta: {
        browser: navigator.userAgent,
      },
    };

    await submitRerenderRequestAction(payload);

    // Show success message
    showSuccessMessage.value = true;

    // Refetch render data after successful submission
    await fetchData();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to submit rerender request";
    submitError.value = errorMessage;
    console.error("Error submitting rerender request:", error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
