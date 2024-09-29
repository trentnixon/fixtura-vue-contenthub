<template>
  <v-navigation-drawer
    id="side-navigation"
    class="bg-surface px-2"
    :model-value="drawer"
    @update:model-value="updateDrawer"
  >
    <v-layout class="fill-height" style="flex-direction: column">
      <template v-if="!Boolean(getOrganizationDetails?.details)">
        <v-skeleton-loader type="paragraph"></v-skeleton-loader>
      </template>
      <template v-else>
        <v-container class="bg-surface text-center p-2">
          <!-- Added p-2 for padding and rounded-md for border-radius -->
          <v-avatar
            class="mb-0"
            v-if="getOrganizationDetails && getOrganizationDetails.details"
            size="x-large"
          >
            <v-img
              :alt="getAccountName"
              :src="
                getOrganizationDetails.details.attributes.Logo.data.attributes
                  .url
              "
            ></v-img>
          </v-avatar>
          <BodyText>{{ getAccountName }}</BodyText>
        </v-container>
      </template>
      <v-container
        class="bg-surface pa-1 text-start flex-grow-1 d-flex flex-column pa-0 overflow-y-auto p-1"
        fluid
      >
        <!-- Replaced pa-1 with p-1 and added rounded-md -->
        <v-list>
          <!-- Bundle link with correct icon -->
          <v-list-item
            class="rounded-md shadow-2"
            v-if="accountid"
            :to="{ path: `/${accountid}` }"
            title="Bundles"
            subtitle="Your seasons Assets"
          >
            <template v-slot:append>
              <v-icon>mdi-package-variant-closed</v-icon>
            </template>
          </v-list-item>
          <v-divider class="my-2"></v-divider>
          <v-list v-if="renderId">
            <!-- Render link with correct icon -->
            <v-list-item
              class="rounded-md shadow-2"
              :to="{ path: `/${accountid}/${sport}/${renderId}` }"
              :title="getRenderTime.date"
              subtitle="Selected Bundle"
              active-class="active-nav-item"
            >
              <template v-slot:append>
                <v-icon>mdi-text-box-outline</v-icon>
              </template>
            </v-list-item>
            <template v-if="renderId">
              <v-divider class="my-2"></v-divider>
            </template>

            <!-- Dynamic list of categories with icons and truncated text -->
            <template v-if="renderId && downloadStats.groupingCategories">
              <v-list>
                <v-list-item
                  class="rounded-md shadow-2 my-1"
                  active-class="active-nav-item"
                  v-for="(item, index) in downloadStats.groupingCategories"
                  :title="truncateText(item, 20)"
                  :subtitle="`Assets
                ${getAssetCount(item)} `"
                  :key="index"
                  :to="{
                    path: `/${accountid}/${sport}/${renderId}/${item.toLowerCase()}`,
                  }"
                >
                  <template v-slot:append>
                    <v-icon>{{ getIconForCategory(item) }}</v-icon>
                  </template>
                </v-list-item>
              </v-list>
              <v-divider class="my-2"></v-divider>
            </template>
          </v-list>
        </v-list>
      </v-container>

      <v-container class="pa-0 mt-auto">
        <v-divider></v-divider>
        <div class="text-small text-bold text-center py-2">Fixtura 2024</div>
        <v-divider></v-divider>
      </v-container>
    </v-layout>
  </v-navigation-drawer>
</template>

<script setup>
// Import necessary modules
import { defineProps, defineEmits, ref, watch } from "vue";
import { useRoute } from "vue-router";

// Import composables and components
import { useAccountData } from "@/pages/account/composables/useAccountData";
import { useDownloadData } from "@/pages/render/composables/useDownloadData";

import BodyText from "@/components/primitives/text/BodyText.vue";

import { fetchRenderById } from "@/store/renders/actions";
import { useRenderData } from "@/pages/render/composables/useRenderData";

// Define props and emits
const props = defineProps({
  drawer: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Routers
const route = useRoute();

const accountid = ref(Number(route.params.accountid));
const renderId = ref(Number(route.params.renderid));
const sport = ref(route.params.sport);

const { getRenderTime } = useRenderData();

// Watch for changes in the route parameters
watch(
  () => route.params,
  async (newParams) => {
    accountid.value = Number(newParams.accountid);
    renderId.value = Number(newParams.renderid);
    sport.value = newParams.sport;

    await fetchRenderById(newParams.renderid);
  }
);

const emits = defineEmits(["update:drawer"]);

// Function to emit the updated drawer state
function updateDrawer(value) {
  emits("update:drawer", value);
}

// Use account data composable
const { getAccountName, getOrganizationDetails, loading } = useAccountData();

// Download stats
const { downloadStats } = useDownloadData();

// Function to dynamically choose the icon for each category
function getIconForCategory(category) {
  switch (category.toLowerCase()) {
    case "senior":
      return "mdi-account-group"; // Example icon for senior
    case "junior":
      return "mdi-human-male-boy"; // Example icon for junior
    default:
      return "mdi-map-marker"; // Default icon
  }
}

// Function to truncate the text to a specified length
function truncateText(text, length) {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
}

const getAssetCount = (item) => downloadStats.value.groupingCategory[item];
</script>
<style scoped>
.footer {
  position: sticky;
  bottom: 0;
  z-index: 1;
}
</style>
