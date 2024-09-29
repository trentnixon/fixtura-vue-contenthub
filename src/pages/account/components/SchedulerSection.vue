<template>
  <ContainerBlueGreyDarken2>
    <v-row>
      <v-col class="d-flex justify-end align-center pa-0" cols="12">
        <CustomChip label="Queued" :value="isSchedulerQueued" type="boolean" />
        <CustomChip
          label="Rendering"
          :value="isSchedulerRendering"
          type="boolean"
        />
      </v-col>
    </v-row>
  </ContainerBlueGreyDarken2>
</template>

<script setup>
import ContainerBlueGreyDarken2 from "@/components/containers/ContainerBlueGreyDarken2.vue";
import CustomChip from "@/components/primitives/chips/CustomChip.vue";
import { useAccountData } from "@/pages/account/composables/useAccountData";

const { isSchedulerQueued, isSchedulerRendering } = useAccountData();
</script>
