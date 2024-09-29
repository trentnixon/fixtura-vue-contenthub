<template>
    <v-chip-group
        v-model="selected"
        :column="column"
        :class="groupClass"
    >
        <Chip
            v-for="(item, index) in items"
            :key="index"
            :label="item.label"
            :color="item.color || color"
            :outlined="item.outlined || outlined"
            :size="item.size || size"
            :type="item.type || type"
        />
    </v-chip-group>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import Chip from '@/components/primitives/chips/Chip.vue';

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    selected: {
        type: Array,
        default: () => [],
    },
    column: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: 'primary',
    },
    outlined: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: 'medium', // 'small', 'medium', 'large'
    },
    type: {
        type: String,
        default: 'default', // 'default', 'boolean', 'status'
    },
    groupClass: {
        type: String,
        default: '',
    },
});

const selected = ref(props.selected);
</script>

<style scoped>
/* Custom styles for chip group */
</style>
