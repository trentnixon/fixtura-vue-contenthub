import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

export function useSideNav() {
  const route = useRoute();

  const accountid = ref(Number(route.params.accountid));
  const renderId = ref(Number(route.params.renderid));
  const sport = ref(route.params.sport);
  const groupingcategory = ref(route.params.groupingcategory);

  const hasRenderId = computed(() => Boolean(renderId.value));

  function isActiveCategory(category: string) {
    const currentCategory = Array.isArray(groupingcategory.value)
      ? groupingcategory.value[0]
      : groupingcategory.value;
    return category.toLowerCase() === currentCategory?.toLowerCase();
  }

  watch(
    () => route.params,
    (newParams) => {
      accountid.value = Number(newParams.accountid);
      renderId.value = Number(newParams.renderid);
      sport.value = newParams.sport;
      groupingcategory.value = newParams.groupingcategory;
    }
  );

  return {
    accountid,
    renderId,
    sport,
    groupingcategory,
    hasRenderId,
    isActiveCategory,
  };
}
