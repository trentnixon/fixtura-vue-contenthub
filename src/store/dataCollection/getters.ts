import { computed } from "vue";
import { usePrivateDataCollectionState } from "./private";
import { format } from "date-fns";

//
export const dataCollections = computed(
  () => usePrivateDataCollectionState().dataCollections
);
export const accountDataCollections = computed(
  () => usePrivateDataCollectionState().accountDataCollections
);
export const dataCollectionDetails = computed(
  () => usePrivateDataCollectionState().dataCollectionDetails
);
export const loading = computed(() => usePrivateDataCollectionState().loading);
export const error = computed(() => usePrivateDataCollectionState().error);

export const dataCollectionCount = computed(() => dataCollections.value.length);
export const accountDataCollectionCount = computed(
  () => accountDataCollections.value.length
);
export const firstTenCollections = computed(() =>
  dataCollections.value.slice(0, 10)
);
export const collectionsCount = computed(() => dataCollections.value.length);

/**
 * This computed property generates a summary of the time taken and memory usage for all data collections on the account.
 * It maps over the account data collections and extracts the date of the last collection and the time taken and memory usage
 * of each collection. It calculates the average time taken and memory usage across all collections, providing an overview of
 * the data collection process for the account.
 */
export const accountDataCollectionSummary = computed(() => {
  //console.log("accountDataCollections in Store", accountDataCollections.value);
  const collections = accountDataCollections.value;
  const totalCollections = collections.length;
  if (totalCollections === 0) return { averageTime: 0, piechartArray: [] };

  const totalTime = collections.reduce(
    (sum, item) => sum + item.attributes.TimeTaken,
    0
  );
  const averageTime = totalTime / totalCollections;

  const piechartArray = collections
    .map((item) => ({
      name: format(
        new Date(item.attributes.whenWasTheLastCollection),
        "dd/MM/yyyy HH:mm:ss"
      ),
      value: item.attributes.TimeTaken / 60000,
    }))
    .slice(0, 25);

  return { averageTime, piechartArray };
});

/**
 * This computed property generates a summary of memory usage for all data collections on the account.
 * It maps over the account data collections and extracts the date of the last collection and the memory usage
 * of each collection, providing an average memory usage across all collections.
 */
export const accountMemoryTrackingSummary = computed(() => {
  const collections = accountDataCollections.value;
  const totalCollections = collections.length;
  if (totalCollections === 0) return { averageMemory: 0, piechartArray: [] };

  const totalMemory = collections.reduce(
    (sum, item) => sum + item.attributes.MemoryUsage,
    0
  );
  const averageMemory = totalMemory / totalCollections;

  const piechartArray = collections
    .map((item) => ({
      name: item.attributes.whenWasTheLastCollection,
      value: item.attributes.MemoryUsage,
    }))
    .slice(0, 25);

  return { averageMemory, piechartArray };
});

/**
 * This computed property generates a summary of the data collection processing for all collections on the account.
 * It maps over the account data collections and extracts the date of the last collection and the number of processing
 * tracker items for each competition, team, and game.

 */
export const accountDataCollectionProcessingSummary = computed(() => {
  const collections = accountDataCollections.value;
  return collections.map((item) => {
    const date = item.attributes.whenWasTheLastCollection;
    const competitions = item.attributes.processingTracker.competitions;
    const teams = item.attributes.processingTracker.teams;
    const games = item.attributes.processingTracker.games;

    return {
      date,
      competitions,
      teams,
      games,
    };
  });
});

// New computed property for parent-level data aggregation
export const aggregatedDataSummary = computed(() => {
  const collections = usePrivateDataCollectionState().parentDataCollections;
  const totalCollections = collections.length;

  //onsole.log("Total collections:", totalCollections);

  if (totalCollections === 0)
    return { averageTime: 0, averageMemory: 0, piechartArray: [] };

  // Filter collections to ensure they have the necessary attributes
  const validCollections = collections.filter(
    (item) =>
      item.attributes.whenWasTheLastCollection &&
      item.attributes.TimeTaken &&
      item.attributes.account.data.FirstName
  );

  //console.log("Valid collections:", validCollections.length);

  const totalTime = validCollections.reduce(
    (sum, item) => sum + item.attributes.TimeTaken,
    0
  );
  const averageTime = totalTime / validCollections.length;

  const totalMemory = validCollections.reduce(
    (sum, item) => sum + item.attributes.MemoryUsage,
    0
  );
  const averageMemory = totalMemory / validCollections.length;

  //console.log("validCollections ", validCollections);
  const piechartArray = validCollections.map((item) => {
    return {
      name: item.attributes.whenWasTheLastCollection,
      account: item.attributes.account.data.FirstName,
      value: item.attributes.TimeTaken / 60000, // Convert ms to minutes
    };
  });

  //console.log("Piechart array:", piechartArray.length, piechartArray);

  return { averageTime, averageMemory, piechartArray };
});
