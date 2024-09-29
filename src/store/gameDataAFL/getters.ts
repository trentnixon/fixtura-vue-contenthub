import { computed } from "vue";
import { usePrivateGameDataAFLState } from "./private";

export const gameDataAFLs = computed(
  () => usePrivateGameDataAFLState().gameDataAFLs
);
export const gameDataAFLDetails = computed(
  () => usePrivateGameDataAFLState().gameDataAFL
);
export const loading = computed(() => usePrivateGameDataAFLState().loading);
export const error = computed(() => usePrivateGameDataAFLState().error);

export const getGameDataAFLById = (id: number) => {
  return (
    gameDataAFLs.value.find((gameDataAFL) => gameDataAFL.id === id) || null
  );
};

export const gameDataAFLCount = computed(() => gameDataAFLs.value.length);
export const firstTenGameDataAFLs = computed(() =>
  gameDataAFLs.value.slice(0, 10)
);
