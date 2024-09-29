<!-- src/components/render/DownloadsStats.vue -->
<template>
  <v-row class="d-flex justify-center">
    <v-col cols="4" md="4">
      <CardSmall1DataPoint
        icon="mdi-download"
        buttonText=""
        :value="getTotalDownloads"
        subtitle="Total Downloads"
        theme="cardNeutral"
      />
    </v-col>
    <v-col cols="4" md="4">
      <CardSmall1DataPoint
        icon="mdi-download"
        buttonText=""
        :value="totalAiArticles"
        subtitle="Total Articles"
        theme="cardNeutral"
      />
    </v-col>
    <v-col cols="4" md="4">
      <CardSmall1DataPoint
        icon="mdi-download"
        buttonText=""
        :value="checkBundleErrors.assets.length"
        subtitle="Errors"
        :theme="checkBundleErrors ? 'cardError' : 'cardError'"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import CardSmall1DataPoint from "@/components/primitives/cards/CardSmall1DataPoint.vue";
import { useAiArticleData } from "@/pages/render/composables/useAiArticleData";
import { useDownloadData } from "@/pages/render/composables/useDownloadData";

// Use the composable to get download data
const { getTotalDownloads, checkBundleErrors } = useDownloadData();
const { totalAiArticles } = useAiArticleData();
</script>
