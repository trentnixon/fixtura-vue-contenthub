<template>
  <v-navigation-drawer
    id="side-navigation"
    :class="mdAndDown ? 'bg-primary-lighten1' : 'bg-neutral'"
    class="px-2"
    :model-value="drawer"
    @update:model-value="updateDrawer"
  >
    <v-layout class="fill-height" style="flex-direction: column">
      <template v-if="!Boolean(getOrganizationDetails)">
        <v-skeleton-loader type="paragraph"></v-skeleton-loader>
      </template>
      <template v-else>
        <v-container class="text-center p-2">
          <!-- Added p-2 for padding and rounded-md for border-radius -->
          <v-avatar class="mb-0" v-if="getOrganizationDetails" size="x-large">
            <v-img
              :alt="getAccountName"
              :src="getOrganizationDetails.ParentLogo"
            ></v-img>
          </v-avatar>
          <div class="text-body">{{ getAccountName }}</div>
        </v-container>
      </template>
      <v-container
        class="pa-1 text-start flex-grow-1 d-flex flex-column pa-0 p-1"
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
              <v-icon>{{ icons.bundles.bundle }}</v-icon>
            </template>
          </v-list-item>
          <v-divider class="mt-2"></v-divider>
          <v-list v-if="renderId">
            <!-- Render link with correct icon -->
            <v-list-item
              class="rounded-md shadow-2"
              :to="{ path: `/${accountid}/${sport}/${renderId}` }"
              :title="getRenderDate"
              subtitle="Selected Bundle"
              active-class="active-nav-item"
            >
              <template v-slot:append>
                <v-icon>{{ icons.bundles.bundleDate }} </v-icon>
              </template>
            </v-list-item>
            <template v-if="renderId">
              <v-divider class="mt-2"></v-divider>
            </template>

            <!-- Dynamic list of categories with icons and truncated text -->
            <template v-if="renderId && filteredCategoryItems">
              <v-list class="overflow-y-auto" style="min-height: 60vh">
                <v-list-item
                  class="rounded-md shadow-2 my-1"
                  active-class="active-nav-item"
                  v-for="(item, index) in filteredCategoryItems"
                  :key="index"
                  :title="truncateText(item.category, 20)"
                  :subtitle="`Assets: ${item.assetCount} | Articles: ${item.articleCount}`"
                  :to="item.link"
                  :active="isActiveCategory(item.category)"
                >
                  <template v-slot:append>
                    <v-icon>{{ getIconForCategory(item.category) }}</v-icon>
                  </template>
                </v-list-item>
              </v-list>
              <v-divider class="mt-2"></v-divider>
            </template>
          </v-list>
        </v-list>
      </v-container>
    </v-layout>
  </v-navigation-drawer>
</template>

<script setup>
// Import necessary modules
import { defineProps, defineEmits, watch, inject } from "vue";
import { useRoute } from "vue-router";
const icons = inject("icons");
import { useDisplay } from "vuetify";
// Import composables and components
import { useAccountData } from "@/pages/account/composables/useAccountData";
import { useRenderData } from "@/pages/render/composables/useRenderData";
import { useSideNav } from "@/components/navigation/composables/useSideNav";

// Define props and emits
defineProps({
  drawer: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Routers
const route = useRoute();
const { getRenderDate, filteredCategoryItems } = useRenderData();
const { accountid, renderId, sport, groupingcategory, isActiveCategory } =
  useSideNav();

// Watch for changes in the route parameters
watch(
  () => route.params,
  async (newParams) => {
    accountid.value = Number(newParams.accountid);
    renderId.value = Number(newParams.renderid);
    sport.value = newParams.sport;
    groupingcategory.value = newParams.groupingcategory;
  }
);
const { mdAndDown } = useDisplay();
const emits = defineEmits(["update:drawer"]);

// Function to emit the updated drawer state
function updateDrawer(value) {
  emits("update:drawer", value);
}

// Use account data composable
const { getAccountName, getOrganizationDetails } = useAccountData();

// Function to dynamically choose the icon for each category
function getIconForCategory(category) {
  switch (category.toLowerCase()) {
    case "senior":
      return icons.grouping.seniors; // Example icon for senior
    case "junior":
      return icons.grouping.juniors; // Example icon for junior
    case "masters":
      return icons.grouping.masters;
    default:
      return icons.grouping.other; // Default icon
  }
}

// Function to truncate the text to a specified length
function truncateText(text, length) {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
}
</script>
