<template>
    <v-row>
        <v-col cols="8">
            <MainHeader :title="getAccountName" :subtitle="getAccountType" />
        </v-col>
        <v-col class="d-flex justify-end" cols="4">
            <v-avatar class="mb-0" v-if="getOrganizationDetails && getOrganizationDetails.details" size="x-large">
                <v-img :alt="getAccountName"
                    :src="getOrganizationDetails.details.attributes.Logo.data.attributes.url"></v-img>
            </v-avatar>
        </v-col>
    </v-row>


</template>

<script setup>
import MainHeader from '@/components/primitives/headers/MainHeader.vue';
import { useAccountData } from '@/pages/account/composables/useAccountData';

const {
    getAccountName,
    getAccountType,
    getOrganizationDetails,

} = useAccountData();
</script>