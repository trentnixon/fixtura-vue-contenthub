<template>
    <v-btn :prepend-icon="icon" variant="outlined" :color="color" :disabled="disabled" :loading="loading"
        @click="handleClick" class="primary-button">
        {{ label }}
    </v-btn>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: '',
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
});

const emit = defineEmits(['click']);

function handleClick() {
    if (!props.disabled) {
        emit('click');
    }
}
</script>