<template>
  <v-row>
    <v-col cols="8">
      <MainHeader :title="getAccountName" :subtitle="accountTypeLabel" />
    </v-col>
    <v-col class="d-flex justify-end" cols="4">
      <v-avatar class="mb-0" v-if="getOrganizationDetails" size="x-large">
        <v-img
          :alt="getAccountName"
          :src="getOrganizationDetails.ParentLogo"
        ></v-img>
      </v-avatar>
    </v-col>
  </v-row>
</template>

<script setup>
import MainHeader from "@/components/primitives/headers/MainHeader.vue";
import { useAccountData } from "@/pages/account/composables/useAccountData";
import { computed } from "vue";

const { getAccountName, getAccountType, getOrganizationDetails } =
  useAccountData();

const accountTypeLabel = computed(() => {
  return getAccountType.value === 1 ? "Club" : "Association";
});
</script>
