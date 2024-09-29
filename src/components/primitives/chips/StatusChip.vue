<template>
    <v-chip :color="color" :text-color="textColor" outlined>
        {{ chipLabel }}
    </v-chip>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    label: {
        type: [String, Boolean],
        required: true,
    },
    type: {
        type: String,
        default: 'default',
    },
});

const chipLabel = props.label === true ? 'Yes' : props.label === false ? 'No' : props.label;
const color = props.label === true ? 'success' : props.label === false ? 'error' : 'primary';
const textColor = 'white';
</script>

<style scoped>
.v-chip {
    font-weight: bold;
}
</style>
