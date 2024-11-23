<template>
  <ContainerBlueGreyDarken2>
    <v-row>
      <v-col class="d-flex justify-end align-center pa-0" cols="12">
        <CustomChip
          :label="label"
          :value="ChipValue"
          type="boolean"
          size="small"
        />
      </v-col>
    </v-row>
  </ContainerBlueGreyDarken2>
</template>

<script setup>
import ContainerBlueGreyDarken2 from "@/components/containers/ContainerBlueGreyDarken2.vue";
import CustomChip from "@/components/primitives/chips/CustomChip.vue";
import { useAccountData } from "@/pages/account/composables/useAccountData";
import { computed } from "vue";

const { isSchedulerQueued, isSchedulerRendering } = useAccountData();

const label = computed(() => {
  return !isSchedulerRendering.value && !isSchedulerQueued.value
    ? "Scheduler Idol"
    : "Scheduler Processing";
});
const ChipValue = computed(() => {
  return !isSchedulerRendering.value && !isSchedulerQueued.value ? true : false;
});
</script>
