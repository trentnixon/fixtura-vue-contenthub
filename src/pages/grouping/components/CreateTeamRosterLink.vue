<template>
  <!-- Display the download stats in a data table when data is loaded -->
  <v-card class="py-2 px-1 elevation-0 bg-accent-lighten1 rounded-md mt-2">
    <div class="text-body py-2 px-4"></div>
    <v-card class="pa-4 elevation-0 bg-surface rounded-md">
      <FlexLayout
        :columns="[
          { cols: 8, class: 'pa-2' },
          { cols: 4, class: 'pa-2' },
        ]"
        justify="space-apart"
        direction="row"
        wrap="wrap"
        align="center"
      >
        <template #col-0>
          <div class="text-body d-flex justify-start align-center">
            Create and update team rosters for upcoming fixtures in just one
            click.
          </div>
        </template>
        <template #col-1>
          <div class="my-box d-flex justify-end align-center">
            <IconButton
              :to="rosterLink"
              color="accent"
              icon="mdi-arrow-right"
              size="small"
              variant="tonal"
            />
          </div>
        </template>
      </FlexLayout>
    </v-card>
  </v-card>
</template>

<script setup>
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import FlexLayout from "@/components/primitives/layout/FlexLayout.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
// Get route parameters
const route = useRoute();
const renderId = ref(Number(route.params.renderid));
const accountId = ref(Number(route.params.accountid));
const groupingCategory = ref(route.params.groupingcategory);

// Function to create rosters
const rosterLink = computed(() => {
  console.log("Create Rosters");
  // vue link to  renderId/cricket/6852/senior/rosterposter
  const accountId = Number(route.params.accountid);
  const sport = route.params.sport;
  const renderId = Number(route.params.renderid);
  return `/${accountId}/${sport}/${renderId}/${groupingCategory.value}/rosterposter`;
});
</script>
