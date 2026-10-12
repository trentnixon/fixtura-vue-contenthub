<template>
  <v-navigation-drawer
    id="side-navigation"
    :class="mdAndDown ? 'bg-primary-lighten1' : 'bg-neutral'"
    class="px-2"
    :model-value="drawer"
    @update:model-value="updateDrawer"
  >
    <div class="side-nav">
      <div class="side-nav__org">
        <template v-if="!Boolean(getOrganizationDetails)">
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </template>
        <template v-else>
          <v-container class="text-center pa-2">
            <v-avatar class="mb-0" v-if="getOrganizationDetails" size="x-large">
              <v-img
                :alt="getAccountName"
                :src="getOrganizationDetails.ParentLogo"
              ></v-img>
            </v-avatar>
            <div class="text-body">{{ getAccountName }}</div>
          </v-container>
        </template>
      </div>
      <div class="side-nav__body">
        <v-list class="side-nav__pinned">
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
        </v-list>
        <template v-if="renderId">
          <v-divider class="mt-2"></v-divider>
          <v-list class="side-nav__pinned">
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
          </v-list>
          <v-divider class="mt-2"></v-divider>
          <div v-if="filteredCategoryItems" class="side-nav__categories">
            <v-list>
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
          </div>
        </template>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
// Import necessary modules
import { watch, inject } from "vue";
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
    groupingcategory.value = decodeURIComponent(
      String(newParams.groupingcategory || "")
    );
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

<style scoped>
:deep(.v-navigation-drawer__content) {
  min-height: 0;
}

.side-nav {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.side-nav__org,
.side-nav__pinned {
  flex: 0 0 auto;
}

.side-nav__body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

.side-nav__categories {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
</style>
