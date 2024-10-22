import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useRendersStore } from "@/store/renders";
import { storeToRefs } from "pinia";

export function useRenderData() {
  const renderStore = useRendersStore();
  const {
    loading,
    error,
    getRenderTableData,
    renderMetrics,
    getRenderDate,
    getRenderTime,
    getProcessing,
    getComplete,
  } = storeToRefs(renderStore);

  // Logic for the render table data
  // State for search input
  const search = ref("");
  const route = useRoute();

  // Prepare the data for the table
  const categoryItems = computed(() => {
    const tableData = getRenderTableData.value;

    return Object.entries(tableData || {}).map(([category, data]) => ({
      category, // The category name, like "Senior"
      assetCount: data.downloads || 0, // Total downloads
      articleCount: data.aiWriteups || 0, // Total AI write-ups
      errors: data.hasErrors ? 1 : 0, // Show 1 if there are errors, otherwise 0
      link: getCategoryLink(category), // Generate the link
    }));
  });

  // Filter the data based on search input
  const filteredCategoryItems = computed(() => {
    return categoryItems.value.filter((item) =>
      item.category.toLowerCase().includes(search.value.toLowerCase())
    );
  });

  // Function to generate the link to the category's page
  function getCategoryLink(category: string) {
    const accountId = Number(route.params.accountid); // Replace with dynamic value if needed
    const sport = route.params.sport; // Replace with dynamic value if needed
    const renderId = Number(route.params.renderid); // Replace with dynamic value if needed

    // Encode the category and replace forward slashes with %2F
    const encodedCategory = encodeURIComponent(category.toLowerCase()).replace(
      /\//g,
      "%2F"
    );

    return `/${accountId}/${sport}/${renderId}/${encodedCategory}`;
  }

  // Function to determine chip color based on count
  function getAssetCountColor(count: number) {
    if (count > 100) return "red";
    else if (count > 50) return "orange";
    else return "green";
  }

  return {
    loading,
    error,
    search,
    categoryItems,
    filteredCategoryItems,
    renderMetrics,
    getCategoryLink,
    getAssetCountColor,
    getRenderDate,
    getRenderTime,
    getProcessing,
    getComplete,
  };
}
