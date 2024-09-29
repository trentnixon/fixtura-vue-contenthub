<template>
    <v-row>
        <v-col cols="8">
            <MainHeader :title='groupingCategory.toUpperCase()' :subtitle='`${getRenderTime.date} Bundle`' />
        </v-col>
        <v-col class="d-flex justify-end" cols="4">
            <!--  <CustomChip label="Processed" :value="!isProcessing" type="boolean" />
            <CustomChip label="Completed" :value="isComplete" type="boolean" /> -->
        </v-col>
    </v-row>


</template>

<script setup>
// vue
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
// composables
import { useRenderData } from "@/pages/render/composables/useRenderData";
// Components
import MainHeader from '@/components/primitives/headers/MainHeader.vue';


const route = useRoute();
const groupingCategory = ref(route.params.groupingcategory);


const {
    getRenderTime
} = useRenderData();


watch(() => route.params, (newParams) => {
    groupingCategory.value = newParams.groupingcategory;
});
</script>