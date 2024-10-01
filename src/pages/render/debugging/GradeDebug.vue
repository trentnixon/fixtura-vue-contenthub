<template>
  <v-container fluid class="pa-0">
    <h1>Grades Debug Information</h1>

    <v-alert v-if="error" type="error" class="mt-4">
      Error: {{ error }}
    </v-alert>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="mt-4"
    ></v-progress-circular>

    <div v-if="groupGradesByName && !loading" class="mt-4">
      <v-expansion-panels flat>
        <!-- Grouped by Grade Name -->
        <v-expansion-panel
          v-for="(grades, gradeName) in groupGradesByName"
          :key="gradeName"
        >
          <v-expansion-panel-title color="primary">{{
            gradeName
          }}</v-expansion-panel-title>
          <v-expansion-panel-text>
            <ul>
              <li v-for="grade in grades" :key="grade.id">
                Grade ID: {{ grade.id }}
              </li>
            </ul>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGradeData } from "@/pages/render/composables/OLD_useGradeData";

// Get route parameters
const route = useRoute();
const renderId = Number(route.params.renderid);

const { fetchGradesByRenderId, groupGradesByName, loading, error } =
  useGradeData();

// Fetch grades by render ID on component mount
/*   onMounted(async () => {
    await fetchGradesByRenderId(renderId);
  }); */
</script>

<style scoped>
pre {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
}
</style>
