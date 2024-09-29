<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2>Text Styles</h2>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12">
          <h3>Body Text</h3>
          <BodyText>
            This is an example of body text. It's used for most of the content text in the application.
          </BodyText>
        </v-col>
        <v-col cols="12">
          <h3>Small Text</h3>
          <SmallText>
            This is an example of small text. It's typically used for captions or secondary information.
          </SmallText>
        </v-col>
      </v-row>
    </v-container>
  </template>

  <script setup>
  import BodyText from '@/components/primitives/text/BodyText.vue';
  import SmallText from '@/components/primitives/text/SmallText.vue';
  </script>

  <style scoped>
  h2 {
    margin-top: 32px;
    font-size: 1.5rem;
    color: var(--v-theme-secondary);
  }

  h3 {
    font-size: 1.25rem;
    color: var(--v-theme-accent);
    margin-bottom: 8px;
  }

  v-divider {
    margin-bottom: 24px;
  }
  </style>
