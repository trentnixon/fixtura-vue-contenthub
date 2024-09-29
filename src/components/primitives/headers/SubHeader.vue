<template>
    <div class="text-h6">{{ title }}</div>
    <div class="text-subtitle-2" v-if="subtitle">{{ subtitle }}</div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: false,
    },
});
</script>