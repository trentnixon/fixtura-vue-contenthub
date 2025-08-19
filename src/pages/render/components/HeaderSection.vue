<template>
  <template v-if="loading">
    <v-skeleton-loader type="paragraph"></v-skeleton-loader>
  </template>
  <template v-else>
    <v-row>
      <v-col cols="8">
        <MainHeader :title="`${getRenderDate} Bundle`" :subtitle="`Processed at ${getRenderTime}`" />
      </v-col>
      <v-col class="d-flex justify-end" cols="4" v-if="!$vuetify.display.xs">
        <CustomChip label="Processed" :value="!getProcessing" type="boolean" size="small" />
        <CustomChip label="Completed" :value="getComplete" type="boolean" size="small" />
      </v-col>
    </v-row>
  </template>
</template>

<script setup>
import MainHeader from "@/components/primitives/headers/MainHeader.vue";
import { useRenderData } from "@/pages/render/composables/useRenderData";
import CustomChip from "@/components/primitives/chips/CustomChip.vue";
const {
  loading,
  error,
  getRenderDate,
  getRenderTime,
  getProcessing,
  getComplete,
} = useRenderData();
</script>
