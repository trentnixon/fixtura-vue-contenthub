<template>
    <v-tabs v-model="activeTab">
        <v-tab v-for="(category, index) in categories" :key="index" :title="category.title">
            {{ category.title }}
        </v-tab>

        <v-tab-item v-for="(category, index) in categories" :key="index">
            <v-container>
                <slot :name="category.slotName"></slot>
            </v-container>
        </v-tab-item>
    </v-tabs>
</template>

<script setup>
import { ref, defineProps, watch, defineEmits } from 'vue';

const props = defineProps({
    categories: {
        type: Array,
        required: true,
        default: () => [],
    },
    modelValue: {
        type: Number,
        default: 0,
    },
});

const emits = defineEmits(['update:modelValue']);

const activeTab = ref(props.modelValue);

watch(activeTab, (newValue) => {
    emits('update:modelValue', newValue);
});
</script>

<style scoped>
.v-tabs {
    background-color: var(--v-theme-background);
}

.v-tab {
    color: var(--v-theme-primary);
}

.v-tab--active {
    color: var(--v-theme-secondary);
}

.v-tab-item {
    padding-top: 16px;
}
</style>