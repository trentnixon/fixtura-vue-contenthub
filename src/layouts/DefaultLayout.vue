<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <slot /> <!-- Content from the home page will be injected here -->
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { VApp, VMain, VContainer, VRow, VCol } from 'vuetify/components';
</script>
