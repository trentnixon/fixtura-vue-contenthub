<template>
    <v-breadcrumbs :items="breadcrumbItems">
        <template v-slot:item="{ item, href, disabled }">
            <v-breadcrumbs-item :href="href" :disabled="disabled" @click.prevent="handleBreadcrumbClick(item)">
                {{ item.text }}
            </v-breadcrumbs-item>
        </template>
    </v-breadcrumbs>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGroupedAssetsData } from '@/pages/grouping/composables/useGroupedAssetsData';
import { useGlobalComposable } from '@/utils/useGlobalComposable'; // Importing global composable

// Router and Route composables
const router = useRouter();
const route = useRoute();

// Reactive route parameters
const groupingCategory = ref(route.params.groupingcategory || '');
const accountid = ref(Number(route.params.accountid));
const renderId = ref(Number(route.params.renderid));
const sport = ref(route.params.sport);

// Using global composable to get display names for assets
const { getDisplayName } = useGlobalComposable();

// Breadcrumb items computed based on route params
const breadcrumbItems = computed(() => {
    return [
        {
            text: 'Account',
            path: `/${accountid.value}`
        },
        {
            text: getDisplayName(sport.value),
            path: `/${accountid.value}/${sport.value}`
        },
        {
            text: getDisplayName(groupingCategory.value),
            path: `/${accountid.value}/${sport.value}/${renderId.value}/${groupingCategory.value}`
        }
    ];
});

// Function to navigate when breadcrumb is clicked
function handleBreadcrumbClick(item) {
    if (item.path) {
        router.push(item.path);
    }
}
</script>