<template>
    <!-- How to Guide Section -->
    <v-card v-if="showInstructions" class="pa-0 my-4" elevation="4">
        <div class="d-flex align-center justify-space-between px-4 py-2 w-100 bg-info-lighten1">
            <div class="card-title">How to Create Team Rosters</div>
            <IconButton :icon="showInstructions ? icons.ui.instructionsOff : icons.ui.instructions" color="primary"
                @click="toggleInstructions" variant="tonal" size="small" tooltip="Hide Instructions" />
        </div>

        <v-expansion-panels elevation="0">
            <v-expansion-panel>
                <v-expansion-panel-title color="surface">
                    <div class="card-title"><v-icon>{{ icons.ui.sync }}</v-icon> Syncing With PlayHQ </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <div class="text-body">
                        To sync your team rosters with the latest data from PlayHQ, click the
                        <IconButton :icon="icons.ui.sync" color="primary" @click="null" variant="tonal" size="small"
                            tooltip="Sync with PlayHQ" :loading="loading || isPolling"
                            :disabled="loading || isPolling" /> icon.
                        This will ensure your rosters are up to date. Please note that syncing may overwrite any manual
                        changes
                        you have made.
                    </div>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-title color="surface">
                    <div class="card-title"> <v-icon>{{ icons.ui.edit }}</v-icon> Editing and Saving </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <div class="text-body">
                        Our Edit feature gives you control to make last-minute changes and additions to your rosters.
                    </div>
                    <div class="text-body">
                        The
                        <IconButton :icon="icons.ui.edit" color="primary" @click="null" variant="tonal" size="small"
                            tooltip="Edit" :loading="loading || isPolling" :disabled="loading || isPolling" /> icon
                        allows you to
                        edit a player's name, while the
                        <IconButton :icon="icons.ui.delete" color="primary" @click="null" variant="tonal" size="small"
                            tooltip="Delete" :loading="loading || isPolling" :disabled="loading || isPolling" /> icon
                        will remove a
                        player from the roster.
                    </div>
                    <div class="text-body">
                        You can add missing players using the
                        <IconButton :icon="icons.ui.add" color="primary" @click="null" variant="tonal" size="small"
                            tooltip="Add Player" :loading="loading || isPolling" :disabled="loading || isPolling" />
                        icon. Don't
                        forget to save any changes made before rendering by clicking the
                        <IconButton :icon="icons.ui.save" color="primary" @click="null" variant="tonal" size="small"
                            tooltip="Save" :loading="loading || isPolling" :disabled="loading || isPolling" /> icon.
                    </div>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-title color="surface">
                    <div class="card-title"> <v-icon>{{ icons.media.createImage }}</v-icon> Create and Download</div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <div class="text-body">
                        To create images for your team roster, click the
                        <IconButton :icon="icons.media.createImage" color="primary" @click="null" variant="tonal"
                            size="small" tooltip="Create Image" :loading="loading || isPolling"
                            :disabled="loading || isPolling" /> icon. This
                        will generate visual assets for your team.
                    </div>
                    <div class="text-body">
                        This process may take a while, but your team roster will be available for download in the "View
                        Downloads"
                        section once completed.
                    </div>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
</template>

<script setup>
import IconButton from "@/components/primitives/buttons/IconButton.vue";
import { useStorage } from "@vueuse/core";
import { defineProps, inject } from "vue";
const icons = inject("icons");
const props = defineProps({
    showInstructions: {
        type: Boolean,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
    isPolling: {
        type: Boolean,
        required: true,
    },
});
// eslint-disable-next-line
const emit = defineEmits(["toggleInstructions"]);
//const showInstructionsLocal = useStorage("showInstructions", props.showInstructions);
const showInstructions = useStorage('showInstructions', props.showInstructions)
//const toggleInstructions = () => emit("toggleInstructions");
const toggleInstructions = () => {
    showInstructions.value = !showInstructions.value;
};
</script>