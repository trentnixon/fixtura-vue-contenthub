<template>
    <v-container :fluid="fluid" :class="containerClass">
        <v-row :class="rowClass" :align="align" :justify="justify">
            <v-col v-for="(col, index) in columns" :key="index" :cols="col.cols" :class="col.class">
                <slot :name="'col-' + index"></slot>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    fluid: {
        type: Boolean,
        default: false,
    },
    columns: {
        type: Array,
        required: true,
    },
    align: {
        type: String,
        default: 'start', // Could be start, center, end, etc.
    },
    justify: {
        type: String,
        default: 'start', // Could be start, center, end, space-between, etc.
    },
    containerClass: {
        type: String,
        default: '',
    },
    rowClass: {
        type: String,
        default: '',
    },
});
</script>
