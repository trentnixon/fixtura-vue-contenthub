import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useDownloadsStore } from "@/store/downloads";
import { parseHubRoute } from "@/lib/analytics";
import { showEditNotice } from "@/pages/edit/composables/useEditNotice";
import _ from "lodash";

export function useSaveFixturaAsset() {
  const downloadsStore = useDownloadsStore();
  const { getDownloadData } = storeToRefs(downloadsStore);
  const route = useRoute();

  const isSaving = ref(false);

  // Make dataObjRef a computed property to stay in sync with getDownloadData
  const dataObjRef = computed(() => ({ ...getDownloadData.value?.dataObj }));

  // Update local dataObjRef with new data while deeply merging
  function updateDataObj(newDataObj) {
    _.merge(dataObjRef.value, newDataObj); // Deep merge
  }

  // Save updated dataObj back to CMS
  async function saveToCMS() {
    const { downloads } = getDownloadData.value || {};
    if (!downloads || downloads.length === 0) {
      console.warn("No downloads available to save.");
      await showEditNotice("Could not save changes", "error");
      return false;
    }

    try {
      isSaving.value = true;
      const routeContext = parseHubRoute(route);
      let savedAny = false;
      let failed = false;

      for (const download of downloads) {
        if (!download.id) {
          console.warn("Download has no ID and cannot be saved.");
          failed = true;
          continue;
        }

        const saved = await downloadsStore.saveFixturaAsset(
          download.id,
          dataObjRef.value,
          {
            account_id: routeContext.account_id,
            render_id: routeContext.render_id,
            asset_type: routeContext.asset_type,
          }
        );

        if (saved) {
          savedAny = true;
        } else {
          console.warn(`Save failed for download ID ${download.id}.`);
          failed = true;
        }
      }

      if (savedAny && !failed) {
        await showEditNotice("Changes saved", "success");
        return true;
      }

      await showEditNotice("Could not save changes", "error");
      return false;
    } catch (error) {
      console.error("Failed to save data to CMS:", error);
      await showEditNotice("Could not save changes", "error");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  return {
    dataObj: dataObjRef,
    updateDataObj,
    saveToCMS,
    isSaving: computed(() => isSaving.value),
  };
}
