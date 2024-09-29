import { computed } from "vue";
import { usePrivateClubToCompetitionState } from "./private";

export const clubToCompetition = computed(
  () => usePrivateClubToCompetitionState().clubToCompetition
);
export const clubToCompetitions = computed(
  () => usePrivateClubToCompetitionState().clubToCompetitions
);
export const loading = computed(
  () => usePrivateClubToCompetitionState().loading
);
export const error = computed(() => usePrivateClubToCompetitionState().error);

export const getClubToCompetitionById = (id: number) => {
  return (
    clubToCompetitions.value.find(
      (clubToCompetition) => clubToCompetition.id === id
    ) || null
  );
};
