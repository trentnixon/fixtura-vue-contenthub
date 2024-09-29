<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2>Modals</h2>
          <v-divider></v-divider>
        </v-col>

        <v-col cols="6">
          <h3>Preview Modal</h3>
          <v-btn color="primary" @click="showPreviewModal = true">Show Preview Modal</v-btn>
          <PreviewModal v-model="showPreviewModal" title="Preview Title">
            <p>This is the content inside the preview modal.</p>
          </PreviewModal>
        </v-col>

        <v-col cols="6">
          <h3>Confirmation Modal</h3>
          <v-btn color="secondary" @click="showConfirmationModal = true">Show Confirmation Modal</v-btn>
          <ConfirmationModal
            v-model="showConfirmationModal"
            title="Confirmation Title"
            @confirm="onConfirm"
          >
            <p>Are you sure you want to confirm this action?</p>
          </ConfirmationModal>
        </v-col>
      </v-row>
    </v-container>
  </template>

  <script setup>
  import { ref } from 'vue';
  import PreviewModal from '@/components/primitives/modals/PreviewModal.vue';
  import ConfirmationModal from '@/components/primitives/modals/ConfirmationModal.vue';

  const showPreviewModal = ref(false);
  const showConfirmationModal = ref(false);

  const onConfirm = () => {
    //console.log('Confirmed!');
  };
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
