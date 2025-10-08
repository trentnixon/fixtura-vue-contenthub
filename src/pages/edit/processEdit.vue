<template>
  <HeaderSection title="Editor" />

  <!-- Blocker for missing selected asset -->
  <div v-if="isBlocked" class="blocker-message">
    <h2>Cannot Edit</h2>
    <p>No items found. Please access this page through the appropriate link.</p>
  </div>

  <!-- Render the edit portal based on the asset type -->
  <div v-else>
    <div v-if="isMdAndUp">
      <component :is="assetEditComponent" :assetType="assetType" />
    </div>
    <div v-else class="blocker-message">
      <h2>Editor Unavailable</h2>
      <p>Editor is only available on desktop and tablet devices.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useRenderAssets } from "@/pages/asset/composables/useRenderAssets";
import HeaderSection from "@/pages/edit/components/HeaderSection.vue";
import { useDisplay } from "vuetify";

// Import asset-specific edit components
import WeekendResultsEdit from "@/pages/edit/AssetEditPortals/WeekendResultsEdit.vue";
import LadderEdit from "@/pages/edit/AssetEditPortals/LadderEdit.vue";
import Top5Edit from "@/pages/edit/AssetEditPortals/Top5Edit.vue";
import UpComingFixturesEdit from "@/pages/edit/AssetEditPortals/UpComingFixturesEdit.vue";

// Responsive handling
const { mdAndUp } = useDisplay();
const isMdAndUp = computed(() => mdAndUp?.value ?? true);

const route = useRoute();
const { selectedFixturaAsset } = useRenderAssets();

// Map asset types to components
const assetEditComponents = {
  cricketresults: WeekendResultsEdit,
  cricketladder: LadderEdit,
  crickettop5bowling: Top5Edit,
  crickettop5batting: Top5Edit,
  cricketupcoming: UpComingFixturesEdit,
  cricketresultsingle: WeekendResultsEdit,
};

// Asset type logic
const assetType = computed(() => {
  const type = route.query.asset || selectedFixturaAsset.value?.assetType || "";
  return typeof type === "string" ? type.toLowerCase() : "";
});

// Determine access and the component to render
const assetEditComponent = computed(
  () => assetEditComponents[assetType.value] || null
);
const isBlocked = computed(() => !assetEditComponent.value);
</script>

<style scoped>
.blocker-message {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}

.blocker-message h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.blocker-message p {
  font-size: 1rem;
}
</style>
