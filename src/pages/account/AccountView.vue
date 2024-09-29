<template>
  <!-- Loading with a different type -->
  <LoadingSpinner v-if="loading" type="paragraph" />

  <!-- Error Message -->
  <ErrorMessage v-else-if="error" :message="error" />

  <template v-else>
    <HeaderSection />
    <v-divider class="my-4" />
    <RendersTable />
    <SchedulerSection />
    <!-- <DebuggingAccount /> -->
  </template>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAccountData } from "@/pages/account/composables/useAccountData";

import HeaderSection from "@/pages/account/components/HeaderSection.vue";
import SchedulerSection from "@/pages/account/components/SchedulerSection.vue";
import RendersTable from "@/pages/account/components/RendersTable.vue";
//import DebuggingAccount from '@/pages/account/debugging/DebuggingAccount.vue';
import LoadingSpinner from "@/components/UI/LoadingSpinner.vue";
import ErrorMessage from "@/components/UI/ErrorMessage.vue";
const route = useRoute();
const accountId = Number(route.params.accountid);

const { fetchAccountById, loading, error } = useAccountData();
// Fetch account data only once when the component is mounted
onMounted(() => {
  fetchAccountById(accountId);
});

watch(loading, () => {
  if (!loading.value) {
    console.log("Account data loaded");
  }
});
</script>
