// store/accountMediaLibrary/getters.ts
import { computed } from "vue";
import { usePrivateAccountMediaLibraryState } from "./private";

export const accountMediaLibraries = computed(() => {
  return usePrivateAccountMediaLibraryState().accountMediaLibraries;
});

export const loading = computed(() => {
  return usePrivateAccountMediaLibraryState().loading;
});

export const error = computed(() => {
  return usePrivateAccountMediaLibraryState().error;
});

export const accountMediaLibraryCount = computed(() => {
  return usePrivateAccountMediaLibraryState().accountMediaLibraries.length;
});

export const firstTenImages = computed(() => {
  return usePrivateAccountMediaLibraryState().accountMediaLibraries.slice(
    0,
    10
  );
});

export const imageCount = computed(() => {
  return usePrivateAccountMediaLibraryState().accountMediaLibraries.length;
});
