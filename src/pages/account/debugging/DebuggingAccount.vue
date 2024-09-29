<template>
    <v-container>
        <h1>Account Debug Information</h1>

        <v-alert v-if="error" type="error" class="mt-4">
            Error: {{ error }}
        </v-alert>

        <v-progress-circular v-if="loading" indeterminate color="primary" class="mt-4"></v-progress-circular>

        <div v-if="selectedAccount && !loading" class="mt-4">
            <v-expansion-panels flat>
                <!-- Account Name -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="primary">Account Name</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>{{ getAccountName }}</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Account Type -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="secondary">Account Type</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>{{ getAccountType }}</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Organization Details -->
                <v-expansion-panel v-if="getOrganizationDetails">
                    <v-expansion-panel-title color="primary">Organization Details</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>Type: {{ getOrganizationDetails.type }}</p>
                        <p>ID: {{ getOrganizationDetails.details.id }}</p>
                        <p>Name: {{ getOrganizationDetails.details.attributes.Name }}</p>
                        <p>URL: {{ getOrganizationDetails.details.attributes.Logo?.data?.attributes?.url }}</p>

                    </v-expansion-panel-text>
                </v-expansion-panel>



                <!-- Subscription Tier -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="secondary">Subscription Tier</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>Title: {{ getAccountSubscription.attributes.Title }}</p>
                        <p>Description: {{ getAccountSubscription.attributes.description }}</p>
                        <p>Price: {{ getAccountSubscription.attributes.price }} {{
                            getAccountSubscription.attributes.currency }}
                        </p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Sport -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="primary">Sport</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>{{ getAccountSport }}</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Theme -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="secondary">Theme</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>{{ getAccountTheme.Name }}</p>
                        <p>Primary Color: {{ getAccountTheme.primary }}</p>
                        <p>Secondary Color: {{ getAccountTheme.secondary }}</p>
                        <p>Dark: {{ getAccountTheme.dark }}</p>
                        <p>White: {{ getAccountTheme.white }}</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Template -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="primary">Template</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>{{ getTemplateDetails.Name }}</p>
                        <p>Category: {{ getTemplateDetails.Category }}</p>
                        <p>Variation: {{ getTemplateDetails.Variation }}</p>
                        <p>Description: {{ getTemplateDetails.Description }}</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Render Token -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="secondary">Render Token</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>Token: {{ getAccountRenderToken.token }}</p>
                        <p>Expiration: {{ getRenderExpiration }}</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Scheduler -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="secondary">Scheduler</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>{{ getScheduler?.Name || 'No Scheduler' }}</p>
                        <p>Queued: {{ isSchedulerQueued ? 'Yes' : 'No' }}</p>
                        <p>Rendering: {{ isSchedulerRendering ? 'Yes' : 'No' }}</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Sponsors -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="primary">Sponsors</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <ul>
                            <li v-for="sponsor in getSponsors" :key="sponsor.id">{{ sponsor.attributes.Name }}</li>
                        </ul>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Trial Instance -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="secondary">Trial Instance</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <p>Start Date: {{ getTrialInstance.startDate }}</p>
                        <p>End Date: {{ getTrialInstance.endDate }}</p>
                        <p>Is Active: {{ getTrialStatus ? 'Yes' : 'No' }}</p>
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!-- Raw Account Data -->
                <v-expansion-panel>
                    <v-expansion-panel-title color="primary">Raw Account Data</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <pre>{{ selectedAccount }}</pre>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
    </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAccountData } from "@/pages/account/composables/useAccountData";

// Get route parameters
const route = useRoute();
const accountId = Number(route.params.accountid);

const {
    selectedAccount,
    fetchAccountById,
    getAccountName,
    getAccountType,
    getOrganizationDetails,
    getAccountSport,
    getAccountTheme,
    getTemplateDetails,
    getAccountRenderToken,
    getRenderExpiration,
    getScheduler,
    isSchedulerQueued,
    isSchedulerRendering,
    getSponsors,
    getTrialInstance,
    getTrialStatus,
    getAccountSubscription,
    loading,
    error,
} = useAccountData();

// Fetch account details on component mount
onMounted(async () => {
    //await fetchAccountById(accountId);
});


</script>

<style scoped>
pre {
    background: #f5f5f5;
    padding: 16px;
    border-radius: 4px;
}
</style>
