<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h2>Category Tabs</h2>
                <v-divider></v-divider>
            </v-col>

            <v-col cols="12">
                <CategoryTabs :categories="categories" v-model="activeTab" />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" v-if="activeTab === 0">
                <p>This is the content for Category 1.</p>
            </v-col>
            <v-col cols="12" v-if="activeTab === 1">
                <p>This is the content for Category 2.</p>
            </v-col>
            <v-col cols="12" v-if="activeTab === 2">
                <p>This is the content for Category 3.</p>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import CategoryTabs from '@/components/primitives/tabs/CategoryTabs.vue';

const categories = [
    { title: 'Category 1', slotName: 'category1' },
    { title: 'Category 2', slotName: 'category2' },
    { title: 'Category 3', slotName: 'category3' },
];

const activeTab = ref(0);
</script>

<style scoped>
h2 {
    margin-top: 32px;
    font-size: 1.5rem;
    color: var(--v-theme-secondary);
}

v-divider {
    margin-bottom: 24px;
}
</style>
