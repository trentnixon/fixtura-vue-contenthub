import { computed } from "vue";
import { usePrivateGameMetaDatasState } from "./private";

export const gameMetaDatas = computed(
  () => usePrivateGameMetaDatasState().gameMetaDatas
);
export const gameMetaDataDetails = computed(
  () => usePrivateGameMetaDatasState().gameMetaData
);
export const loading = computed(() => usePrivateGameMetaDatasState().loading);
export const error = computed(() => usePrivateGameMetaDatasState().error);

export const getGameMetaDataById = (id: number) => {
  return (
    gameMetaDatas.value.find((gameMetaData) => gameMetaData.id === id) || null
  );
};

export const gameMetaDataCount = computed(() => gameMetaDatas.value.length);
export const firstTenGameMetaDatas = computed(() =>
  gameMetaDatas.value.slice(0, 10)
);
