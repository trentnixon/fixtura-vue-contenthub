<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h2>Headers</h2>
                <v-divider></v-divider>
            </v-col>
            <v-col cols="12">
                <h3>Main Header</h3>
                <MainHeader title="Welcome to the Content Hub" subtitle="Your digital assets, ready for download." />
            </v-col>
            <v-col cols="12">
                <h3>Sub Header</h3>
                <SubHeader title="Upcoming Fixtures" subtitle="Stay updated with the latest fixtures." />
            </v-col>
            <v-col cols="12">
                <h3>Category Header</h3>
                <CategoryHeader title="Top 5 Performers" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import MainHeader from '@/components/primitives/headers/MainHeader.vue';
import SubHeader from '@/components/primitives/headers/SubHeader.vue';
import CategoryHeader from '@/components/primitives/headers/CategoryHeader.vue';
</script>

<style scoped>
h2 {
    margin-top: 32px;
    font-size: 1.5rem;
    color: var(--v-theme-secondary);
}

h3 {
    font-size: 1.25rem;
    color: var(--v-theme-accent);
    margin-bottom: 8px;
}

v-divider {
    margin-bottom: 24px;
}
</style>
