<template>
    <v-card class="notification-card" :color="color" dark>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
            <p>{{ message }}</p>
        </v-card-text>
        <v-card-actions>
            <v-btn color="white" @click="$emit('close')">Close</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
        default: "info",
    },
});
</script>

<style scoped>
.notification-card {
    max-width: 300px;
    margin: 16px;
}
</style>