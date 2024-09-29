<template>
  <v-row>
    <v-col cols="8">
      <MainHeader
        :title="`${getRenderTime.date} Bundle`"
        :subtitle="`Processed at ${getRenderTime.time}`"
      />
    </v-col>
    <v-col class="d-flex justify-end" cols="4" v-if="!$vuetify.display.xs">
      <CustomChip label="Processed" :value="!isProcessing" type="boolean" />
      <CustomChip label="Completed" :value="isComplete" type="boolean" />
    </v-col>
  </v-row>
</template>

<script setup>
import MainHeader from "@/components/primitives/headers/MainHeader.vue";
import { useRenderData } from "@/pages/render/composables/useRenderData";
import CustomChip from "@/components/primitives/chips/CustomChip.vue";
const { isProcessing, isComplete, getRenderTime } = useRenderData();
</script>
