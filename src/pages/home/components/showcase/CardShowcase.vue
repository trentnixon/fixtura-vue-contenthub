<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2>Cards</h2>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="4">
          <h3>Asset Card</h3>
          <AssetCard
            title="Asset Title"
            subtitle="Asset Subtitle"
            description="This is a description of the asset."
            image="https://via.placeholder.com/400x200"
            @action="onCardAction('Asset Card Action')"
          />
        </v-col>
        <v-col cols="4">
          <h3>Statistic Card</h3>
          <StatisticCard
            title="Statistic"
            value="42"
            description="This is a brief description of the statistic."
            @action="onCardAction('Statistic Card Action')"
          />
        </v-col>
        <v-col cols="4">
          <h3>Notification Card</h3>
          <NotificationCard
            title="Notification"
            message="This is an important notification."
            color="error"
            @close="onCardAction('Notification Card Closed')"
          />
        </v-col>
      </v-row>
    </v-container>
  </template>

  <script setup>
  import AssetCard from '@/components/primitives/cards/AssetCard.vue';
  import StatisticCard from '@/components/primitives/cards/StatisticCard.vue';
  import NotificationCard from '@/components/primitives/cards/NotificationCard.vue';

  function onCardAction(message) {
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
