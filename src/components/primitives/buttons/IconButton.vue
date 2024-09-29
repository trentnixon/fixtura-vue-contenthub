<template>
    <v-btn icon :color="color" :disabled="disabled" :loading="loading" @click="handleClick" class="icon-button"
        variant="flat" :size="size">
        <v-icon>{{ icon }}</v-icon>
    </v-btn>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: 'primary',
    },
    size: {
        type: String,
        default: 'small',
    }
});

const emit = defineEmits(['click']);

function handleClick() {
    if (!props.disabled) {
        emit('click');
    }
}
</script>
