<template>
  <v-app-bar
    color="bg-surface"
    scroll-behavior="elevate"
    class="border-b-sm px-4"
  >
    <template v-if="!drawer">
      <v-app-bar-nav-icon @click="toggleDrawer" variant="text" />
    </template>

    <!-- Icon Buttons -->
    <IconButton
      v-if="!$vuetify.display.smAndDown"
      icon="mdi-home"
      class="mx-1"
      color="cta1"
      @click="navigateTo('https://www.fixtura.com.au/', true)"
    />

    <template v-if="accountId && !$vuetify.display.smAndDown">
      <IconButton
        icon="mdi-package-variant-closed"
        class="mx-1"
        color="cta1"
        @click="navigateTo()"
      />
    </template>
    <v-spacer></v-spacer>
    <QuickSelectAssetType />
    <QuickSelectGrouping />

    <v-avatar
      v-if="!$vuetify.display.smAndDown"
      size="36px"
      image="/img/icons/favicon-32x32.png"
      rounded="0"
    ></v-avatar>
  </v-app-bar>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useRouter, useRoute } from "vue-router";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import QuickSelectAssetType from "@/pages/asset/components/QuickSelectAssetType.vue";
import QuickSelectGrouping from "@/pages/render/components/QuickSelectGrouping.vue";
// Router instance
const router = useRouter();
const route = useRoute();
// Props and emits
defineProps({
  title: {
    type: String,
    required: true,
    default: "Dashboard",
  },
  drawer: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Consts
const accountId = Number(route.params.accountid);

const emits = defineEmits(["toggle-drawer"]);

// Toggle drawer function
function toggleDrawer() {
  emits("toggle-drawer");
}

// Navigation function
function navigateTo(destination, external = false) {
  if (external) {
    window.location.href = destination; // Open external URL
  } else {
    router.push(`/${route.params.accountid}`); // Navigate to internal route
  }
}
</script>
