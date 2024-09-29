<template>


    <v-row class="d-flex justify-center">
        <!-- Total Downloads Card -->
        <v-col cols="4" md="4">
            <CardSmall1DataPoint icon="mdi-download" buttonText="" :value="getTotalDownloads" subtitle="Total Downloads"
                theme="cardNeutral" />
        </v-col>

        <!-- Total Types of Downloads Card -->
        <v-col cols="4" md="4">
            <CardSmall1DataPoint icon="mdi-file-document" buttonText="" :value="totalTypesOfDownloads"
                subtitle="Total Asset Types" theme="cardNeutral" />
        </v-col>

        <!-- Errors Card -->
        <v-col cols="4" md="4">
            <CardSmall1DataPoint icon="mdi-alert-circle" buttonText="" :value="checkBundleErrors.assets.length"
                subtitle="Errors" :theme="checkBundleErrors.assets.length > 0 ? 'cardError' : 'cardNeutral'" />
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import CardSmall1DataPoint from '@/components/primitives/cards/CardSmall1DataPoint.vue';
import { useGroupedAssetsData } from '@/pages/grouping/composables/useGroupedAssetsData';

// Define route and groupingCategory from URL parameters
const route = useRoute();
const groupingCategory = ref(route.params.groupingcategory);

// Reactive composable data fetching with updated groupingCategory
let { getTotalDownloads, getDownloadsGroupedByType, checkBundleErrors } = useGroupedAssetsData(groupingCategory.value);

// Initialize a ref for total types of downloads
const totalTypesOfDownloads = ref(Object.keys(getDownloadsGroupedByType.value).length);

// Function to refetch the data when groupingCategory changes
const reloadData = () => {
    ({ getTotalDownloads, getDownloadsGroupedByType, checkBundleErrors } = useGroupedAssetsData(groupingCategory.value));
    totalTypesOfDownloads.value = Object.keys(getDownloadsGroupedByType.value).length;
};

// Watch for changes in the route parameters and refetch data
watch(
    () => route.params.groupingcategory,
    (newCategory) => {
        groupingCategory.value = newCategory;
        reloadData(); // Trigger re-fetch of the grouped download data
    }
);
</script>
