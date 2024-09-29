<template>
  <div>
    <v-tabs v-model="activeTab" align-tabs="end" color="accent" class="mb-3">
      <v-tab v-for="tab in availableTabs" :key="tab.value" :value="tab.value">
        {{ tab.label }}
      </v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <v-window-item
        v-for="tab in availableTabs"
        :key="tab.value"
        :value="tab.value"
      >
        <slot :name="tab.value" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
// eslint-disable-next-line
const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    // Each tab should be an object with: { value, label, condition }
  },
});

const activeTab = ref(props.tabs[0]?.value || "");

const availableTabs = computed(() => {
  return props.tabs.filter((tab) => {
    if (tab.condition === undefined) return true;
    return tab.condition;
  });
});
</script>
