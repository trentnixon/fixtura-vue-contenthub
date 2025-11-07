import { computed, ref, type Ref } from "vue";
import type { ParsedFixturePrompt, FixtureData } from "@/types/FixtureTypes";
import {
  parseFixturePrompt,
  stringifyFixtureData,
  cloneFixtureData,
} from "@/types/FixtureTypes";
import { updateArticleFixturesAction } from "@/store/aiArticles/actions";
import type { FlattenedArticle } from "@/types/ArticleTypes";

/**
 * Composable for fixture editing operations (CRUD)
 */
export function useFixtureEditing(
  articles: Ref<FlattenedArticle[]>,
  accountId: () => number | null,
  renderId: () => number | null,
  articleId: () => number | null
) {
  // Fixture editing state
  const isEditingFixtures = ref(false);
  const fixtures = ref<ParsedFixturePrompt[]>([]);
  const editingFixtureIndex = ref<number | null>(null);
  const editingFixture = ref<ParsedFixturePrompt | null>(null);
  const unsavedChanges = ref<Set<number>>(new Set());
  const isSavingFixtures = ref(false);
  const fixtureError = ref("");
  const originalFixtures = ref<ParsedFixturePrompt[]>([]); // Store original for comparison
  const expandedSections = ref<number[]>([]); // All sections closed by default
  const fixtureFormRef = ref<any>(null);

  // Store original fixture data when editing starts for comparison
  const originalEditingFixture = ref<ParsedFixturePrompt | null>(null);

  // Computed properties
  const hasUnsavedChanges = computed(() => unsavedChanges.value.size > 0);
  const fixtureCount = computed(() => fixtures.value.length);
  const editingFixtureData = computed(() => {
    return editingFixture.value?.parsedData ?? null;
  });

  // Check if current editing fixture has changes compared to when editing started
  const hasEditingChanges = computed(() => {
    if (!editingFixture.value || !originalEditingFixture.value) return false;
    return (
      stringifyFixtureData(editingFixture.value.parsedData) !==
      stringifyFixtureData(originalEditingFixture.value.parsedData)
    );
  });

  /**
   * Load fixtures from articleDataForPrompt
   */
  async function loadFixtures() {
    const firstArticle = articles.value?.[0];
    if (
      !firstArticle?.ArticleDataForPrompt ||
      firstArticle.ArticleDataForPrompt.length === 0
    ) {
      fixtures.value = [];
      originalFixtures.value = [];
      return;
    }

    // Parse each fixture prompt
    const parsed: ParsedFixturePrompt[] = [];
    for (const fixturePrompt of firstArticle.ArticleDataForPrompt) {
      try {
        const parsedData = parseFixturePrompt(fixturePrompt.prompt);
        parsed.push({
          prompt: fixturePrompt.prompt,
          parsedData: parsedData,
        });
      } catch (error) {
        console.error("Failed to parse fixture:", error);
        // Skip invalid fixtures but continue with others
      }
    }

    fixtures.value = parsed;
    // Deep clone for comparison
    originalFixtures.value = parsed.map((f) => ({
      prompt: f.prompt,
      parsedData: cloneFixtureData(f.parsedData),
    }));
    unsavedChanges.value.clear();
  }

  /**
   * Handler for "Make an Edit to a Fixture" button
   */
  async function onMakeEditToFixture() {
    try {
      isEditingFixtures.value = true;
      fixtureError.value = "";
      await loadFixtures();
    } catch (error: any) {
      fixtureError.value = error?.message || "Failed to load fixtures";
      console.error("Failed to load fixtures:", error);
    }
  }

  /**
   * Navigate back to article view
   */
  function onBackToArticle() {
    if (hasUnsavedChanges.value) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        isEditingFixtures.value = false;
        editingFixtureIndex.value = null;
      }
    } else {
      isEditingFixtures.value = false;
      editingFixtureIndex.value = null;
    }
  }

  /**
   * Save all changes to CMS
   */
  async function onSaveAllChanges() {
    if (!hasUnsavedChanges.value) return;

    const accountIdValue = accountId();
    const renderIdValue = renderId();
    const articleIdValue = articleId();

    if (!accountIdValue || !renderIdValue || !articleIdValue) {
      fixtureError.value = "Missing required IDs";
      return;
    }

    isSavingFixtures.value = true;
    fixtureError.value = "";

    try {
      // Convert fixtures back to prompt strings
      const fixturesToSave = fixtures.value.map((f) => ({
        prompt: stringifyFixtureData(f.parsedData),
      }));

      await updateArticleFixturesAction({
        accountId: accountIdValue,
        renderId: renderIdValue,
        articleId: articleIdValue,
        fixtures: fixturesToSave,
      });

      // Update original fixtures and clear unsaved changes
      originalFixtures.value = fixtures.value.map((f) => ({
        prompt: f.prompt,
        parsedData: cloneFixtureData(f.parsedData),
      }));
      unsavedChanges.value.clear();

      // Optionally refresh article data
      // triggerDataSync();
    } catch (error: any) {
      fixtureError.value = error?.message || "Failed to save fixtures";
    } finally {
      isSavingFixtures.value = false;
    }
  }

  /**
   * Handle edit fixture
   */
  function onEditFixture(index: number) {
    if (index < 0 || index >= fixtures.value.length) return;

    // Deep clone the fixture for editing
    const fixture = fixtures.value[index];
    editingFixture.value = {
      prompt: fixture.prompt,
      parsedData: cloneFixtureData(fixture.parsedData),
    };
    // Store original for comparison
    originalEditingFixture.value = {
      prompt: fixture.prompt,
      parsedData: cloneFixtureData(fixture.parsedData),
    };
    editingFixtureIndex.value = index;
  }

  /**
   * Cancel editing and return to list
   */
  function onCancelEdit() {
    if (hasEditingChanges.value) {
      if (
        confirm(
          "You have unsaved changes. Are you sure you want to discard them?"
        )
      ) {
        editingFixtureIndex.value = null;
        editingFixture.value = null;
        originalEditingFixture.value = null;
      }
    } else {
      editingFixtureIndex.value = null;
      editingFixture.value = null;
      originalEditingFixture.value = null;
    }
  }

  /**
   * Save fixture (updates local state, marks as unsaved)
   */
  async function onSaveFixture(formRefComponent?: any) {
    if (editingFixtureIndex.value === null || editingFixture.value === null)
      return;

    // Validate form before saving
    const form = formRefComponent?.formRef || fixtureFormRef.value;
    if (form) {
      const { valid } = await form.validate();
      if (!valid) {
        fixtureError.value = "Please fix validation errors before saving";
        return;
      }
    }

    const index = editingFixtureIndex.value;

    // Clear any previous errors
    fixtureError.value = "";

    // Update the fixture in the fixtures array
    fixtures.value[index] = {
      prompt: stringifyFixtureData(editingFixture.value.parsedData),
      parsedData: cloneFixtureData(editingFixture.value.parsedData),
    };

    // Mark as having unsaved changes
    unsavedChanges.value.add(index);

    // Return to list view
    editingFixtureIndex.value = null;
    editingFixture.value = null;
  }

  /**
   * Helper functions for managing arrays in fixture data
   */
  function addInning(teamType: "homeTeam" | "awayTeam") {
    if (!editingFixture.value) return;

    const team = editingFixture.value.parsedData[teamType];
    const newInningNumber = team.innings.length + 1;

    team.innings.push({
      teamName: team.teamName,
      score: "",
      overs: "",
      wickets: 0,
      battingOrder: [],
      bowlingFigures: [],
      fieldingStats: [],
      fallOfWickets: [],
      inningsNumber: newInningNumber,
      inningsName: `${team.teamName} Batting`,
    });
  }

  function removeInning(
    teamType: "homeTeam" | "awayTeam",
    inningIndex: number
  ) {
    if (!editingFixture.value) return;

    const team = editingFixture.value.parsedData[teamType];
    if (inningIndex >= 0 && inningIndex < team.innings.length) {
      team.innings.splice(inningIndex, 1);
      // Update innings numbers
      team.innings.forEach((inning, idx) => {
        inning.inningsNumber = idx + 1;
      });
    }
  }

  function addPlayer(teamType: "homeTeam" | "awayTeam", inningIndex: number) {
    if (!editingFixture.value) return;

    const inning =
      editingFixture.value.parsedData[teamType].innings[inningIndex];
    if (inning) {
      inning.battingOrder.push({
        description: "",
      });
    }
  }

  function removePlayer(
    teamType: "homeTeam" | "awayTeam",
    inningIndex: number,
    playerIndex: number
  ) {
    if (!editingFixture.value) return;

    const inning =
      editingFixture.value.parsedData[teamType].innings[inningIndex];
    if (
      inning &&
      playerIndex >= 0 &&
      playerIndex < inning.battingOrder.length
    ) {
      inning.battingOrder.splice(playerIndex, 1);
    }
  }

  function addBowler(teamType: "homeTeam" | "awayTeam", inningIndex: number) {
    if (!editingFixture.value) return;

    const inning =
      editingFixture.value.parsedData[teamType].innings[inningIndex];
    if (inning) {
      inning.bowlingFigures.push({
        description: "",
      });
    }
  }

  function removeBowler(
    teamType: "homeTeam" | "awayTeam",
    inningIndex: number,
    bowlerIndex: number
  ) {
    if (!editingFixture.value) return;

    const inning =
      editingFixture.value.parsedData[teamType].innings[inningIndex];
    if (
      inning &&
      bowlerIndex >= 0 &&
      bowlerIndex < inning.bowlingFigures.length
    ) {
      inning.bowlingFigures.splice(bowlerIndex, 1);
    }
  }

  function addFielder(teamType: "homeTeam" | "awayTeam", inningIndex: number) {
    if (!editingFixture.value) return;

    const inning =
      editingFixture.value.parsedData[teamType].innings[inningIndex];
    if (inning) {
      inning.fieldingStats.push({
        description: "",
      });
    }
  }

  function removeFielder(
    teamType: "homeTeam" | "awayTeam",
    inningIndex: number,
    fielderIndex: number
  ) {
    if (!editingFixture.value) return;

    const inning =
      editingFixture.value.parsedData[teamType].innings[inningIndex];
    if (
      inning &&
      fielderIndex >= 0 &&
      fielderIndex < inning.fieldingStats.length
    ) {
      inning.fieldingStats.splice(fielderIndex, 1);
    }
  }

  function addWicket(teamType: "homeTeam" | "awayTeam", inningIndex: number) {
    if (!editingFixture.value) return;

    const inning =
      editingFixture.value.parsedData[teamType].innings[inningIndex];
    if (inning) {
      inning.fallOfWickets.push({
        wicketNumber: inning.fallOfWickets.length + 1,
        score: "",
        batsman: "",
      });
    }
  }

  function removeWicket(
    teamType: "homeTeam" | "awayTeam",
    inningIndex: number,
    wicketIndex: number
  ) {
    if (!editingFixture.value) return;

    const inning =
      editingFixture.value.parsedData[teamType].innings[inningIndex];
    if (
      inning &&
      wicketIndex >= 0 &&
      wicketIndex < inning.fallOfWickets.length
    ) {
      inning.fallOfWickets.splice(wicketIndex, 1);
      // Update wicket numbers
      inning.fallOfWickets.forEach((wicket, idx) => {
        wicket.wicketNumber = idx + 1;
      });
    }
  }

  return {
    // State
    isEditingFixtures,
    fixtures,
    editingFixtureIndex,
    editingFixture,
    unsavedChanges,
    isSavingFixtures,
    fixtureError,
    originalFixtures,
    expandedSections,
    fixtureFormRef,

    // Computed
    hasUnsavedChanges,
    hasEditingChanges,
    fixtureCount,
    editingFixtureData,

    // Methods
    loadFixtures,
    onMakeEditToFixture,
    onBackToArticle,
    onSaveAllChanges,
    onEditFixture,
    onCancelEdit,
    onSaveFixture,

    // Array manipulation helpers
    addInning,
    removeInning,
    addPlayer,
    removePlayer,
    addBowler,
    removeBowler,
    addFielder,
    removeFielder,
    addWicket,
    removeWicket,
  };
}
