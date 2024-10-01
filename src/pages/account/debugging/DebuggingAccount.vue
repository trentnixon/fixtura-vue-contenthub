<template>
  <v-container>
    <h1>Account Debug Information</h1>

    <v-alert v-if="error" type="error" class="mt-4">
      Error: {{ error }}
    </v-alert>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="mt-4"
    ></v-progress-circular>
    <div class="mt-4">
      <v-expansion-panels flat>
        <!-- Account Name -->
        <v-expansion-panel>
          <v-expansion-panel-title color="primary"
            >Account Name</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <p>{{ getAccountName }}</p>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-title color="primary"
            >getAccountRenderToken</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <p>{{ getAccountRenderToken }}</p>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title color="primary"
            >getOrganizationDetails</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <p>{{ getOrganizationDetails }}</p>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title color="primary"
            >getAccountTemplate</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <p>{{ getAccountTemplate }}</p>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title color="primary"
            >getAccountRenders</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <p>{{ getAccountRenders }}</p>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Account Type -->
        <v-expansion-panel>
          <v-expansion-panel-title color="secondary"
            >Account Type</v-expansion-panel-title
          >
          <v-expansion-panel-text>
            <p>{{ getAccountType }}</p>
            <p>{{ rollupMetrics }}</p>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-container>
</template>

<script setup>
import { watch } from "vue";
import { useAccountData } from "@/pages/account/composables/useAccountData";

const {
  loading,
  error,
  getAccountType,
  rollupMetrics,
  getAccountName,
  getAccountRenderToken,
  getOrganizationDetails,
  getAccountTemplate,
  getAccountRenders,
} = useAccountData();

watch(loading, (newVal) => {
  console.log("loading", newVal);
});

// Fetch account details on component mount
</script>

<style scoped>
pre {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
}
</style>
