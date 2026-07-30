<template>
  <v-list-item
    class="my-2 border pa-2"
    :class="{ 'bg-surface-lighten1': selected }"
    @click="$emit('select', index)"
  >
    <template v-slot:prepend>
      <span
        class="totw-drag-handle d-flex align-center mr-1"
        title="Drag to reorder"
      >
        <v-icon size="small">mdi-drag-vertical</v-icon>
      </span>
      <v-radio
        :model-value="selected"
        :value="true"
        hide-details
        density="compact"
        @click.stop="$emit('select', index)"
      />
      <v-avatar v-if="player.club?.logo?.url" class="ml-2">
        <v-img
          :src="player.club.logo.url"
          :alt="player.primaryTeam || player.player"
        />
      </v-avatar>
    </template>

    <v-list-item-title>
      {{ listPosition }}. {{ displayName }}
      <span class="text-caption text-medium-emphasis ml-1">
        ({{ primaryStat }})
      </span>
    </v-list-item-title>

    <v-list-item-subtitle>
      {{ categoryLabel }}
      <template v-if="player.primaryTeam"> — {{ player.primaryTeam }}</template>
    </v-list-item-subtitle>

    <template v-slot:append>
      <span @click.stop>
        <IconButton
          icon="mdi-account-remove"
          tooltip="Remove player"
          size="small"
          color="error"
          variant="text"
          :disabled="!canRemove"
          @click="$emit('remove', index)"
        />
      </span>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TotwPlayer } from "@/types/TeamOfTheWeek";
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import {
  getCategoryPositionLabel,
  getPlayerDisplayName,
  getPrimaryStatLabel,
} from "@/pages/edit/composables/useTotwPlayerStats";

const props = defineProps<{
  player: TotwPlayer;
  index: number;
  selected: boolean;
  canRemove?: boolean;
}>();

defineEmits<{
  select: [index: number];
  remove: [index: number];
}>();

const canRemove = computed(() => props.canRemove ?? true);
const listPosition = computed(() => props.index + 1);
const displayName = computed(() => getPlayerDisplayName(props.player));
const categoryLabel = computed(() => getCategoryPositionLabel(props.player));
const primaryStat = computed(() => getPrimaryStatLabel(props.player));
</script>

<style scoped>
.totw-drag-handle {
  cursor: grab;
  color: rgba(var(--v-theme-on-surface), 0.54);
}

.totw-drag-handle:active {
  cursor: grabbing;
}
</style>
