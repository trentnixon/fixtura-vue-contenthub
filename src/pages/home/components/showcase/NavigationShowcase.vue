<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h2>Navigation Components</h2>
                <v-divider></v-divider>
            </v-col>

            <v-col cols="12">
                <h3>Top Navigation</h3>
                <TopNavigation title="Content Hub" @toggle-drawer="toggleDrawer" />
            </v-col>

            <v-col cols="12" class="mt-4">
                <h3>Breadcrumb</h3>
                <BreadcrumbNavigation />
            </v-col>

            <v-col cols="12" class="mt-4">
                <h3>Side Navigation</h3>
                <SideNavigation />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import TopNavigation from '@/components/navigation/TopNavigation.vue';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation.vue';
import SideNavigation from '@/components/navigation/SideNavigation.vue';

function toggleDrawer() {
    console.log('Drawer toggled');
}
</script>

<style scoped>
h2 {
    margin-top: 32px;
    font-size: 1.5rem;
    color: var(--v-theme-secondary);
}

h3 {
    margin-top: 16px;
    font-size: 1.25rem;
    color: var(--v-theme-accent);
}
</style>
