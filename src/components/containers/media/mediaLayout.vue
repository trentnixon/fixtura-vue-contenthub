<template>
  <v-container class="pa-0 ma-0" fluid>
    <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md">
      <v-toolbar class="px-1 py-0 my-0" color="transparent" rounded density="compact">
        <slot name="header" />
      </v-toolbar>
      <v-card class="pa-1 elevation-0 bg-surface rounded-md">
        <v-card flat rounded color="surface" class="pa-0 ma-0">
          <v-container class="pa-0 ma-0">
            <slot name="loading" />
            <slot name="renderError" />
            <slot name="body" />
            <slot name="noContent" />
          </v-container>
        </v-card>
      </v-card>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: "MediaLayout",
};
</script>
