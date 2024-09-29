<template>
    <v-row>
        <v-col cols="12">
            <h2>Buttons</h2>
            <v-divider></v-divider>
        </v-col>
        <v-col cols="4">
            <h3>Primary Button</h3>
            <PrimaryButton label="Primary Button" @click="onClick('Primary Button Clicked')" />
        </v-col>
        <v-col cols="4">
            <h3>Secondary Button</h3>
            <SecondaryButton label="Secondary Button" @click="onClick('Secondary Button Clicked')" />
        </v-col>
        <v-col cols="4">
            <h3>Icon Button</h3>
            <IconButton icon="mdi-home" @click="onClick('Icon Button Clicked')" />
        </v-col>
    </v-row>
</template>

<script setup>
import IconButton from '@/components/primitives/buttons/IconButton.vue';
import PrimaryButton from '@/components/primitives/buttons/PrimaryButton.vue';
import SecondaryButton from '@/components/primitives/buttons/SecondaryButton.vue';

function onClick(message) {
    //console.log(message);
}
</script>

<style scoped>
h2 {
    margin-top: 32px;
    font-size: 1.5rem;
    color: var(--v-theme-secondary);
}

h3 {
    font-size: 1.25rem;
    color: var(--v-theme-accent);
    margin-bottom: 8px;
}

v-divider {
    margin-bottom: 24px;
}
</style>
