import { computed } from "vue";
import { useGradesInRenderStore } from "@/store/gradesInRender";
import { storeToRefs } from "pinia";

export function useGradeData() {
  const gradesInRenderStore = useGradesInRenderStore();
  const {
    gradesInRenderByRenderID,
    loading,
    error,
  } = storeToRefs(gradesInRenderStore);

  // Fetch grades by render ID
  async function fetchGradesByRenderId(renderId: number) {
    await gradesInRenderStore.fetchGradesByRenderId(renderId);
  }

  // Group grades by name
  const groupGradesByName = computed(() => {
    return gradesInRenderByRenderID.value.reduce((acc, grade) => {
      const gradeName = grade.attributes.grade?.data?.attributes?.gradeName || "Unknown";

      if (!acc[gradeName]) {
        acc[gradeName] = [];
      }
      acc[gradeName].push(grade);
      return acc;
    }, {} as Record<string, any[]>);
  });
    // Total number of grades
    const totalGrades = computed(() => gradesInRenderByRenderID.value.length);



  return {
    fetchGradesByRenderId,
    groupGradesByName,
    loading,
    error,
    totalGrades
  };
}
