<template>
    <v-container class="bg-background pa-2 border-sm rounded">
        <v-row>
            <v-col cols="4">
                <StatisticCard title="Sport" :value="sport" description="The sport category for this account." />
            </v-col>
            <v-col cols="4">
                <StatisticCard title="Sponsors" :value="sponsors.length" description="Number of sponsors." />
                <ul v-if="sponsors.length">
                    <li v-for="sponsor in sponsors" :key="sponsor.id">{{ sponsor.attributes.Name }}</li>
                </ul>
            </v-col>
            <v-col cols="4">
                <StatisticCard title="Template" :value="templateDetails.Name"
                    description="The template used for assets." />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { defineProps } from 'vue';
import StatisticCard from '@/components/primitives/cards/StatisticCard.vue';

const props = defineProps({
    sport: String,
    sponsors: Array,
    templateDetails: Object,
});
</script>
