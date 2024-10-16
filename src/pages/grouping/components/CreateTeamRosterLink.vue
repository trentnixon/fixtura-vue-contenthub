<template>
  <template v-if="getAccountType === 1">
    <CardHeader :title="`Team Rosters`" subtitle="" />
    <!-- Display the download stats in a data table when data is loaded -->

    <v-card class="pa-4 elevation-0 bg-accent-lighten1  rounded-md">
      <FlexLayout :columns="[
        { cols: 8, class: 'pa-2' },
        { cols: 4, class: 'pa-2' },
      ]" justify="space-apart" direction="row" wrap="wrap" align="center">
        <template #col-0>
          <div class="text-body d-flex justify-start align-center">
            Create and update team rosters for upcoming fixtures in just one
            click.
          </div>
        </template>
        <template #col-1>
          <div class="my-box d-flex justify-end align-center">
            <IconButton :to="rosterLink" color="surface" :icon="icons.navigation.internalLink" size="small"
              variant="tonal" />
          </div>
        </template>
      </FlexLayout>
    </v-card>

    <v-divider class="my-4" />
  </template>
</template>

<script setup>
import { computed, ref, inject } from "vue";
import { useRoute } from "vue-router";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import CardHeader from "@/components/primitives/headers/CardHeader.vue";
import FlexLayout from "@/components/primitives/layout/FlexLayout.vue";
import { useAccountData } from "@/pages/account/composables/useAccountData";

const icons = inject("icons");

// Get route parameters
const route = useRoute();
const groupingCategory = ref(route.params.groupingcategory);

const { getAccountType } = useAccountData()

// Function to create rosters
const rosterLink = computed(() => {
  // vue link to  renderId/cricket/6852/senior/rosterposter
  const accountId = Number(route.params.accountid);
  const sport = route.params.sport;
  const renderId = Number(route.params.renderid);
  return `/${accountId}/${sport}/${renderId}/${groupingCategory.value}/rosterposter`;
});
</script>
