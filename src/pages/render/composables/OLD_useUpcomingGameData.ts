import { computed } from "vue";
import { useUpcomingGamesInRenderStore } from "@/store/upcomingGamesInRender";
import { storeToRefs } from "pinia";

export function useUpcomingGameData() {
  const upcomingGamesInRenderStore = useUpcomingGamesInRenderStore();
  const {
    upcomingGamesInRenderByRenderID,
    loading,
    error,
  } = storeToRefs(upcomingGamesInRenderStore);

  // Fetch upcoming games by render ID
  async function fetchUpcomingGamesByRenderId(renderId: number) {
    await upcomingGamesInRenderStore.fetchUpcomingGamesByRenderId(renderId);
  }

  // Group upcoming games by sport
  const groupUpcomingGamesBySport = computed(() => {
    return upcomingGamesInRenderByRenderID.value.reduce((acc, game) => {
      let sport = "Unknown";
      if (game.attributes.game_meta_datum) {
        sport = "Cricket";
      } else if (game.attributes.game_data_afl) {
        sport = "AFL";
      } else if (game.attributes.game_data_netball) {
        sport = "Netball";
      } else if (game.attributes.game_data_hockey) {
        sport = "Hockey";
      } else if (game.attributes.game_data_basketball) {
        sport = "Basketball";
      }

      if (!acc[sport]) {
        acc[sport] = [];
      }
      acc[sport].push(game);
      return acc;
    }, {} as Record<string, any[]>);
  });

   // Total number of upcoming games
   const totalUpcomingGames = computed(() => upcomingGamesInRenderByRenderID.value.length);


  return {
    fetchUpcomingGamesByRenderId,
    groupUpcomingGamesBySport,
    loading,
    error,
    totalUpcomingGames
  };
}
