import { computed } from "vue";
import { usePrivateGameDataNetballState } from "./private";

export const gameDataNetballs = computed(
  () => usePrivateGameDataNetballState().gameDataNetballs
);
export const gameDataNetballDetails = computed(
  () => usePrivateGameDataNetballState().gameDataNetball
);
export const loading = computed(() => usePrivateGameDataNetballState().loading);
export const error = computed(() => usePrivateGameDataNetballState().error);

export const getGameDataNetballById = (id: number) => {
  return (
    gameDataNetballs.value.find(
      (gameDataNetball) => gameDataNetball.id === id
    ) || null
  );
};

export const gameDataNetballCount = computed(
  () => gameDataNetballs.value.length
);
export const firstTenGameDataNetballs = computed(() =>
  gameDataNetballs.value.slice(0, 10)
);
