<template>
  <HeaderSection />
  <!-- Conditional renders for loading and error states -->
  <LoadingSpinner v-if="isLoading" type="table" />
  <ErrorMessage v-else-if="hasError" :message="hasError" />
  <div v-else>
    <!-- Dynamically load the controller for the asset -->
    <AssetController />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import HeaderSection from "@/pages/asset/components/HeaderSection.vue";
import LoadingSpinner from "@/components/UI/LoadingSpinner.vue";
import ErrorMessage from "@/components/UI/ErrorMessage.vue";
import AssetController from "@/pages/asset/components/AssetController.vue";
import { useRendersStore } from "@/store/renders"; // Import the Pinia store
import { useAccountData } from "@/pages/account/composables/useAccountData"; // Import the composable

// Initialize the Pinia store and composables
const rendersStore = useRendersStore();
const { fetchAccountById } = useAccountData();

// Route parameters to be used for fetching data
const route = useRoute();

// Reactive route parameters
const accountId = ref(Number(route.params.accountid));
const renderId = ref(Number(route.params.renderid));
const groupingCategory = ref(route.params.groupingcategory);
const assetType = ref(route.params.asset);

// Watch for route changes and update reactive values
watch(
  () => route.params,
  (newParams) => {
    accountId.value = Number(newParams.accountid);
    renderId.value = Number(newParams.renderid);
    groupingCategory.value = newParams.groupingcategory;
    assetType.value = newParams.asset;
    fetchData(); // Refetch data when route changes
  }
);

// Computed properties for loading and error states
const isLoading = computed(() => rendersStore.loading);
const hasError = computed(() => rendersStore.error);

// Function to fetch all required data
async function fetchData() {
  // Fetch account and render data
  await fetchAccountById(accountId.value);
  await rendersStore.fetchFixturaRenderById(accountId.value, renderId.value);
  await rendersStore.fetchGroupingDetails(
    accountId.value,
    renderId.value,
    groupingCategory.value
  );

  // Fetch assets data
  await rendersStore.fetchAssetsByRenderAction(
    Number(accountId.value), // Ensure the values are numbers if needed
    Number(renderId.value),
    groupingCategory.value,
    assetType.value
  );
}

// Fetch data on component mount
onMounted(() => {
  fetchData();
});
</script>
