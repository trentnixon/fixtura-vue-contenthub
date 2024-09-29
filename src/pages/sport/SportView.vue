<template>
  <div>Sport: {{ sport }}</div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import AccountLayout from '@/layouts/AccountLayout.vue';

const route = useRoute();
const sport = route.params.sport;
</script>
