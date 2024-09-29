<template>
    <v-container fluid class="pa-0">
        <h1>Render Debug Information</h1>

        <v-alert v-if="error" type="error" class="mt-4">
            Error: {{ error }}
        </v-alert>

        <v-progress-circular v-if="loading" indeterminate color="primary" class="mt-4"></v-progress-circular>

        <div v-if="selectedRender && !loading" class="mt-4">
            <v-expansion-panels flat>
                <!-- Render Name -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="primary">Render Name</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>{{ getRenderName }}</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Processing Status -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="primary">Processing Status</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>{{ isProcessing ? 'Processing' : 'Not Processing' }}</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Completion Status -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="secondary">Completion Status</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>{{ isComplete ? 'Complete' : 'Incomplete' }}</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Email Information -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="secondary">Email Information</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>Send Email: {{ getEmailInfo.sendEmail ? 'Yes' : 'No' }}</p>
                        <p>Email Sent: {{ getEmailInfo.emailSent ? 'Yes' : 'No' }}</p>
                        <p>Force Rerender Email: {{ getEmailInfo.forceRerenderEmail ? 'Yes' : 'No' }}</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Team Roster Information -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="primary">Team Roster Information</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>Has Roster Request: {{ getTeamRosterInfo.hasRequest ? 'Yes' : 'No' }}</p>
                        <p>Has Rosters: {{ getTeamRosterInfo.hasRosters ? 'Yes' : 'No' }}</p>
                        <p>Team Roster Email Sent: {{ getTeamRosterInfo.emailSent ? 'Yes' : 'No' }}</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Raw Render Data -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="primary">Raw Render Data</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <pre>{{ selectedRender }}</pre>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
    </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRenderData } from "@/pages/render/composables/useRenderData";

const route = useRoute();
const renderId = Number(route.params.renderid);

const {
    selectedRender,
    fetchRenderById,
    getRenderName,
    isProcessing,
    isComplete,
    getEmailInfo,
    getTeamRosterInfo,
    loading,
    error,
} = useRenderData();

/* onMounted(async () => {
    await fetchRenderById(renderId);
}); */
</script>

<style scoped>
pre {
    background: #f5f5f5;
    padding: 16px;
    border-radius: 4px;
}
</style>