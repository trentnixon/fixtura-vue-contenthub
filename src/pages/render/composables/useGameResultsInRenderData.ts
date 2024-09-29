import { computed } from "vue";
import { useGameResultsInRenderStore } from "@/store/gameResultsInRenderStore";
import { storeToRefs } from "pinia";

export function useGameResultsInRenderData() {
  const gameResultsInRenderStore = useGameResultsInRenderStore();
  const { gameResultsInRenderByRenderID, loading, error } = storeToRefs(
    gameResultsInRenderStore
  );

  // Fetch game results by render ID
  async function fetchGameResultsByRenderId(renderId: number) {
    try {
      await gameResultsInRenderStore.fetchGameResultsInRenderByRenderId(
        renderId
      );
    } catch (err) {
      console.error("Failed to fetch game results by render ID:", err);
    }
  }

  // Group Game Results by Sport
  const groupGameResultsBySport = computed(() => {
    return gameResultsInRenderByRenderID.value.reduce((acc, result) => {
      let sport = "Unknown";
      if (result.attributes.game_meta_datum) {
        sport = "Cricket"; // If game_meta_datum is present, it's categorized as Cricket
      } else if (result.attributes.game_data_afl) {
        sport = "AFL";
      } else if (result.attributes.game_data_netball) {
        sport = "Netball";
      } else if (result.attributes.game_data_hockey) {
        sport = "Hockey";
      } else if (result.attributes.game_data_basketball) {
        sport = "Basketball";
      }

      if (!acc[sport]) {
        acc[sport] = [];
      }
      acc[sport].push(result);
      return acc;
    }, {} as Record<string, any[]>);
  });

  const totalGameResults = computed(
    () => gameResultsInRenderByRenderID.value.length
  );

  return {
    gameResultsInRenderByRenderID,
    loading,
    error,
    fetchGameResultsByRenderId,
    groupGameResultsBySport,
    totalGameResults,
  };
}
