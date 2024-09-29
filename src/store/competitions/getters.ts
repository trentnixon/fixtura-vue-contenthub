import { computed } from "vue";
import { usePrivateCompetitionState } from "./private";

export const competition = computed(
  () => usePrivateCompetitionState().competition
);
export const competitions = computed(
  () => usePrivateCompetitionState().competitions
);
export const loading = computed(() => usePrivateCompetitionState().loading);
export const error = computed(() => usePrivateCompetitionState().error);

export const getCompetitionById = (id: number) => {
  return (
    competitions.value.find((competition) => competition.id === id) || null
  );
};
