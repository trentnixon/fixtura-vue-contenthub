<template>
    <v-card class="pa-1 ma-1" flat>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
        <v-card-text>
            <h1>{{ value }}</h1>
            <p>{{ description }}</p>
        </v-card-text>
    </v-card>
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
    value: {
        type: [String, Number],
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
});
</script>
