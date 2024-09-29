<template>
    <v-breadcrumbs :items="breadcrumbs" class="my-4">
        <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
        </template>
    </v-breadcrumbs>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
    const paths = route.path.split('/').filter(p => p);
    return paths.map((p, index) => ({
        text: p.charAt(0).toUpperCase() + p.slice(1),
        disabled: index === paths.length - 1,
        href: '/' + paths.slice(0, index + 1).join('/'),
    }));
});
</script>

<style scoped>
.v-breadcrumbs {
    background-color: var(--v-theme-background);
}

.v-breadcrumbs-item {
    color: var(--v-theme-primary);
}

.v-breadcrumbs-divider {
    color: var(--v-theme-primary);
}
</style>