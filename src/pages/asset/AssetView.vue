<template>
  <v-toolbar
    class="px-0 py-0 my-0"
    color="transparent"
    rounded
    density="compact"
  >
    <!--  Stats | Urls? -->
    <v-spacer></v-spacer>
    <QuickSelectAssetType />
  </v-toolbar>
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
import { useAssetDownloadData } from "@/pages/asset/composables/useAssetDownloadData";
import QuickSelectAssetType from "@/pages/asset/components/QuickSelectAssetType";
const route = useRoute();

// Reactive route parameters
const asset = ref(route.params.asset);
// Watch for route changes and update reactive values
watch(
  () => route.params,
  (newParams) => {
    asset.value = newParams.asset;
  }
);

// Fetch and manage asset data
const {
  fetchData,
  downloadsLoading,
  downloadsError,
  aiArticlesLoading,
  aiArticlesError,
} = useAssetDownloadData();

// Track loading and error states
const isLoading = computed(
  () => downloadsLoading.value || aiArticlesLoading.value
);
const hasError = computed(() => downloadsError.value || aiArticlesError.value);

// Fetch data when the component is mounted
onMounted(() => {
  fetchData();
});
</script>
