<template>
    <v-dialog v-model="isVisible" max-width="500px" :persistent="persistent">
        <v-card>
            <v-card-title class="text-h5">
                {{ title }}
            </v-card-title>

            <v-card-text>
                <slot />
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <SecondaryButton
                    label="Cancel"
                    @click="close"
                    :disabled="loading || disabled"
                />
                <PrimaryButton
                    label="Confirm"
                    @click="confirm"
                    :loading="loading"
                    :disabled="loading || disabled"
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import PrimaryButton from '@/components/primitives/buttons/PrimaryButton.vue';
import SecondaryButton from '@/components/primitives/buttons/SecondaryButton.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        default: 'Confirmation',
    },
    persistent: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(['update:modelValue', 'confirm']);

const isVisible = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
    isVisible.value = newValue;
});

watch(isVisible, (newValue) => {
    emits('update:modelValue', newValue);
});

const close = () => {
    if (!props.loading && !props.disabled) {
        isVisible.value = false;
    }
};

const confirm = () => {
    if (!props.loading && !props.disabled) {
        emits('confirm');
        close();
    }
};
</script>

<style scoped>
.v-card-title {
    background-color: var(--v-theme-secondary);
    color: var(--v-theme-on-secondary);
}
</style>