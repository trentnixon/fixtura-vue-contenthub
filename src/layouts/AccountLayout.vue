<template>
  <v-responsive class="border rounded">
    <v-app>
      <!-- Bind the drawer prop and listen for updates -->
      <SideNavigation :drawer="drawer" @update:drawer="drawer = $event" />
      <TopNavigation
        :drawer="drawer"
        @toggle-drawer="drawer = !drawer"
        :title="Fixtura"
      />
      <v-main class="bg-surface">
        <v-container class="pa-0" fluid>
          <v-container>
            <router-view />
          </v-container>
          <v-footer class="bg-surface border-t-thin pa-4 mt-2">
            <div class="text-small text-normal text-end mb-0 w-100">
              Fixtura Content Hub {{ new Date().getFullYear() }}
            </div>
          </v-footer>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup>
import { ref } from "vue";
import TopNavigation from "@/components/navigation/TopNavigation.vue";
import SideNavigation from "@/components/navigation/SideNavigation.vue";

// Define your title and drawer state
const Fixtura = ref("Fixtura");
const drawer = ref(true);
</script>
