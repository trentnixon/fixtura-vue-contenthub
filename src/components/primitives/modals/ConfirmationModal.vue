<template>
    <v-dialog v-model="isVisible" max-width="500px">
        <v-card>
            <v-card-title class="text-h5">
                {{ title }}
            </v-card-title>

            <v-card-text>
                <slot />
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="confirm">Confirm</v-btn>
                <v-btn color="secondary" @click="close">Cancel</v-btn>
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
        default: 'Confirmation',
    },
});

const emits = defineEmits(['update:modelValue', 'confirm']);

const isVisible = ref(props.modelValue);

watch(isVisible, (newValue) => {
    emits('update:modelValue', newValue);
});

const close = () => {
    isVisible.value = false;
};

const confirm = () => {
    emits('confirm');
    close();
};
</script>

<style scoped>
.v-card-title {
    background-color: var(--v-theme-secondary);
    color: var(--v-theme-on-secondary);
}
</style>