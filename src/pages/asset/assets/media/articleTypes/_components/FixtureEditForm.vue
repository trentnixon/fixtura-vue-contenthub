<template>
    <div class="fixture-edit-form">
        <!-- Header -->
        <div class="mb-4 d-flex align-center justify-space-between">
            <div class="d-flex align-center">
                <IconButton icon="mdi-arrow-left" tooltip="Back to List" size="small" color="error"
                    @click="$emit('cancel')" />
            </div>
            <div class="d-flex align-center">
                <IconButton icon="mdi-content-save" tooltip="Save changes to this fixture" size="small"
                    :color="hasChanges ? 'success' : 'grey'" @click="$emit('save')" />
            </div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="mb-4 pa-3 bg-error-lighten-5 rounded text-error">
            {{ error }}
        </div>

        <!-- Title -->
        <div class="mb-4" v-if="editingFixtureData">
            <h2 class="text-title">{{ editingFixtureData.homeTeam.teamName }} vs {{ editingFixtureData.awayTeam.teamName
                }}</h2>
            <div v-if="editingFixtureData.matchContext.ageGroup || editingFixtureData.matchContext.grade"
                class="text-caption text-grey mt-1">
                {{ editingFixtureData.matchContext.ageGroup }} {{ editingFixtureData.matchContext.ageGroup &&
                    editingFixtureData.matchContext.grade ? '•' : '' }} {{ editingFixtureData.matchContext.grade }}
            </div>
        </div>

        <!-- Form Sections -->
        <v-form v-if="editingFixtureData" ref="formRef">
            <v-expansion-panels :model-value="expandedSections"
                @update:model-value="$emit('update:expandedSections', $event as number[])" multiple class="mb-4">
                <slot />
            </v-expansion-panels>
        </v-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FixtureData } from "@/types/FixtureTypes";
import IconButton from "@/components/primitives/buttons/IconButton.vue";

const props = defineProps<{
    editingFixtureIndex: number;
    editingFixtureData: FixtureData | null;
    expandedSections: number[];
    error?: string;
    hasChanges?: boolean;
}>();

const emit = defineEmits<{
    save: [];
    cancel: [];
    "update:expandedSections": [value: number[]];
}>();

const formRef = ref<any>(null);

defineExpose({
    formRef,
});
</script>
