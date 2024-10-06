<template>
  <MediaLayout>
    <!-- Header Slot -->
    <template v-slot:header>
      <CategoryHeader title="VIDEO" icon="mdi-video-off" />
      <v-spacer />
      <!-- Polling Indicator -->
      <CustomChip
        label="Please contact Fixtura Support"
        :value="false"
        type="boolean"
      />
    </template>

    <!-- Video Body -->
    <template v-slot:body>
      <div class="d-flex justify-start align-center pa-4">
        <v-icon color="error" class="mr-4">mdi-video-off</v-icon>
        <div class="text-body">Asset has Failed the Second Render</div>
      </div>
    </template>
  </MediaLayout>
</template>

<script setup>
import MediaLayout from "@/components/containers/media/mediaLayout.vue";
import CustomChip from "@/components/primitives/chips/CustomChip.vue";
</script>
