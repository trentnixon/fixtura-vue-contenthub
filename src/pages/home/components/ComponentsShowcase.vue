<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>Components Showcase</h1>
            </v-col>
        </v-row>

        <!-- Import and display different sections -->
        <HeaderShowcase />
        <TextShowcase />
        <ButtonShowcase />
        <CardShowcase />
        <ModalShowcase />
        <TabsShowcase />
        <LayoutShowcase />
        <!-- You can add more sections like InputShowcase, CardShowcase, etc. here -->
    </v-container>
</template>

<script setup>
import ButtonShowcase from '@/pages/home/components/showcase/ButtonShowcase.vue';
import CardShowcase from '@/pages/home/components/showcase/CardShowcase.vue';
import HeaderShowcase from '@/pages/home/components/showcase/HeaderShowcase.vue';
import LayoutShowcase from '@/pages/home/components/showcase/LayoutShowcase.vue';
import ModalShowcase from '@/pages/home/components/showcase/ModalShowcase.vue';
import NavigationShowcase from '@/pages/home/components/showcase/NavigationShowcase.vue';
import TabsShowcase from '@/pages/home/components/showcase/TabsShowcase.vue';
import TextShowcase from '@/pages/home/components/showcase/TextShowcase.vue';


</script>

<style scoped>
h1 {
    margin-bottom: 16px;
    font-size: 2rem;
    color: var(--v-theme-primary);
}
</style>