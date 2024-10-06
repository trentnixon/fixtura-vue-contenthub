<template>
  <div>
    <v-progress-circular
      :size="70"
      :width="7"
      indeterminate
      color="primary"
      class="my-4"
    />
    <div class="text-caption">Sending request to re-render. Please wait...</div>
  </div>
</template>

<script setup></script>

<style scoped>
.text-caption {
  font-size: 14px;
  text-align: center;
}
</style>
