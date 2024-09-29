<template>
    <v-dialog v-model="isVisible" max-width="600px">
        <v-card>
            <v-card-title class="text-h5">
                {{ title }}
            </v-card-title>

            <v-card-text>
                <slot />
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="close">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        default: 'Preview',
    },
});

const emits = defineEmits(['update:modelValue']);

const isVisible = ref(props.modelValue);

watch(isVisible, (newValue) => {
    emits('update:modelValue', newValue);
});

const close = () => {
    isVisible.value = false;
};
</script>

<style scoped>
.v-card-title {
    background-color: var(--v-theme-primary);
    color: var(--v-theme-on-primary);
}
</style>
