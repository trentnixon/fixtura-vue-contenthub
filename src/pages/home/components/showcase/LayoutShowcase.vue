<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h2>Layout Components</h2>
                <v-divider></v-divider>
            </v-col>

            <v-col cols="12" class="mt-4">
                <h3>Grid Layout</h3>
                <GridLayout :columns="[
                    { cols: 6, class: 'pa-2' },
                    { cols: 6, class: 'pa-2' }
                ]" align="center" justify="space-between" fluid>
                    <template #col-0>
                        <div class="my-box">Grid Column 1</div>
                    </template>
                    <template #col-1>
                        <div class="my-box">Grid Column 2</div>
                    </template>
                </GridLayout>
            </v-col>

            <v-col cols="12" class="mt-4">
                <h3>Flex Layout</h3>
                <FlexLayout :columns="[
                    { cols: 4, class: 'pa-2' },
                    { cols: 8, class: 'pa-2' }
                ]" align="center" justify="space-between" direction="row" wrap="wrap">
                    <template #col-0>
                        <div class="my-box">Flex Column 1</div>
                    </template>
                    <template #col-1>
                        <div class="my-box">Flex Column 2</div>
                    </template>
                </FlexLayout>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import GridLayout from '@/components/primitives/layout/GridLayout.vue';
import FlexLayout from '@/components/primitives/layout/FlexLayout.vue';
</script>

<style scoped>
.my-box {
    background-color: var(--v-theme-surface);
    border: 1px solid var(--v-theme-primary);
    padding: 16px;
    text-align: center;
    border-radius: 8px;
}

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