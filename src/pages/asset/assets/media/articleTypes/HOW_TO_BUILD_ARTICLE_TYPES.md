# How to Build Article Types - LLM Guide

This guide explains how article types are built in the Fixtura CMS, their architecture, and how to create new article types following the established patterns.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Folder Structure](#folder-structure)
3. [Main Component Pattern](#main-component-pattern)
4. [Composables Pattern](#composables-pattern)
5. [Components Pattern](#components-pattern)
6. [Utils Pattern](#utils-pattern)
7. [Integration with AssetDisplayArticle](#integration-with-assetdisplayarticle)
8. [Step-by-Step: Building a New Article Type](#step-by-step-building-a-new-article-type)
9. [Common Patterns & Best Practices](#common-patterns--best-practices)
10. [Data Flow Examples](#data-flow-examples)

---

## Architecture Overview

Article types follow a **component-based architecture** with clear separation of concerns:

```
Main Component (WeekendWrapUp.vue, Top5Listicle.vue, LadderSummary.vue, UpcomingFixtures.vue)
    ├── Orchestrates overall workflow
    ├── Manages article generation lifecycle
    ├── Coordinates UI state (loading, error, success)
    └── Delegates logic to composables
        ├── useArticleContext → Context management (all types)
        ├── useArticleFormatting → Article formatting (WeekendWrapUp)
        ├── useTop5Formatting → Article formatting (Top5Listicle)
        ├── useLadderFormatting → Article formatting (LadderSummary)
        ├── useUpcomingFixturesFormatting → Article formatting (UpcomingFixtures)
        ├── useFixtureEditing → Fixture CRUD operations (WeekendWrapUp only)
        ├── useFixtureValidation → Form validation (WeekendWrapUp only)
        └── useFixtureSearchSort → Search/filter/sort (WeekendWrapUp only)
    └── Uses UI components from _components/
        ├── ArticleDisplay → Article rendering (WeekendWrapUp)
        ├── Top5Display → Article rendering (Top5Listicle)
        ├── LadderDisplay → Article rendering (LadderSummary)
        ├── UpcomingFixturesDisplay → Article rendering (UpcomingFixtures)
        ├── ContextDialog → Context input (all types)
        ├── FixtureList → Fixture list view (WeekendWrapUp only)
        ├── FixtureEditForm → Fixture edit form (WeekendWrapUp only)
        └── ... (form sections, tables, etc.)
    └── Uses utilities from _utils/
        └── Helper functions for data manipulation
```

### Key Principles

1. **Separation of Concerns**: Business logic in composables, UI in components, utilities in utils
2. **Reusability**: Composables and components are designed to be reusable across article types
3. **Type Safety**: Full TypeScript support with interfaces and types
4. **State Management**: Reactive state using Vue 3 Composition API
5. **API Integration**: All API calls go through the Pinia store (`@/store/aiArticles`)

---

## Folder Structure

Each article type should follow this structure:

```
articleTypes/
├── YourArticleType.vue          # Main orchestrator component
├── _components/                 # Reusable UI components
│   ├── ArticleDisplay.vue      # Article rendering (if needed)
│   ├── YourCustomSection.vue    # Custom form sections
│   └── readMe.md                # Component documentation
├── _composables/                # Business logic composables
│   ├── useYourDataEditing.ts   # CRUD operations
│   ├── useYourValidation.ts    # Form validation
│   └── readMe.md                # Composable documentation
├── _utils/                      # Helper functions
│   ├── yourHelpers.ts          # Data manipulation utilities
│   └── readMe.md                # Utils documentation
└── readMe.md                    # Article type documentation
```

### Naming Conventions

- **Main Component**: `PascalCase.vue` (e.g., `WeekendWrapUp.vue`, `Top5Listicle.vue`, `LadderSummary.vue`, `UpcomingFixtures.vue`)
- **Composables**: `useCamelCase.ts` (e.g., `useFixtureEditing.ts`, `useArticleContext.ts`, `useTop5Formatting.ts`)
- **Components**: `PascalCase.vue` (e.g., `FixtureList.vue`, `MatchContextSection.vue`, `Top5Display.vue`)
- **Utils**: `camelCase.ts` (e.g., `fixtureHelpers.ts`)

---

## Main Component Pattern

The main component is the **orchestrator** that coordinates all functionality. It follows this structure:

### Template Structure

```vue
<template>
  <div class="pa-4 text-body" :id="copyID">
    <!-- Article View (default) -->
    <div>
      <div class="mb-4 d-flex align-center flex-wrap">
        <!-- Locked state: Show lock icon and label -->
        <template v-if="isLocked">
          <v-icon color="warning" size="small">mdi-lock</v-icon>
          <span class="text-caption ml-2">Article Locked</span>
        </template>

        <!-- Normal state: Show buttons -->
        <template v-else>
          <div
            class="d-flex align-center justify-space-between w-100"
            style="gap: 8px;"
          >
            <IconButton
              icon="mdi-file-document-edit"
              :tooltip="buttonText"
              size="small"
              color="primary"
              :loading="isPending"
              :disabled="isPending"
              @click="showConfirmationDialog = true"
            />
            <div class="d-flex align-center ms-auto" style="gap: 8px;">
              <!-- Additional buttons shown when article is written -->
              <template v-if="showAdditionalButtons">
                <v-tooltip v-if="hasContext" location="top">
                  <template v-slot:activator="{ props }">
                    <v-chip
                      v-bind="props"
                      color="orange"
                      size="small"
                      variant="tonal"
                    >
                      <v-icon start size="x-small">mdi-check-circle</v-icon>
                      Context
                    </v-chip>
                  </template>
                  <span>Context has been added to this article</span>
                </v-tooltip>
                <IconButton
                  icon="mdi-text-box-plus"
                  tooltip="Add Context"
                  size="small"
                  color="success"
                  :loading="isPending"
                  :disabled="isPending"
                  @click="onAddContext"
                />
              </template>
            </div>
          </div>
        </template>

        <div v-if="requestError" class="ml-3 text-error">
          {{ requestError }}
        </div>
      </div>

      <!-- Confirmation Dialog -->
      <ConfirmationModal
        v-model="showConfirmationDialog"
        :title="`Confirm ${buttonText}`"
        :persistent="isPending"
        :loading="isPending"
        :disabled="isPending"
        @confirm="confirmAndRequest"
      >
        <p v-if="articlePhase === 'initial' || articlePhase === 'postPending'">
          Are you sure you want to request a new AI article? This will generate
          a fresh article based on the current data.
        </p>
        <p v-else-if="articlePhase === 'articleWritten'">
          Are you sure you want to request a review? This will generate a new
          version of the article based on your feedback.
        </p>
        <p v-else>Are you sure you want to proceed with this request?</p>
      </ConfirmationModal>

      <!-- Context Dialog -->
      <ContextDialog
        v-model="showContextDialog"
        v-model:contextText="contextText"
        :hasContext="hasContext"
        :isSaving="isSavingContext"
        :error="contextError"
        :success="contextSuccess"
        :maxLength="CONTEXT_MAX_LENGTH"
        :charCount="contextCharCount"
        :charRemaining="contextCharRemaining"
        :charCountClass="contextCharCountClass"
        :isValid="isContextValid"
        :cancelLabel="cancelButtonLabel"
        @save="handleSaveContext"
        @delete="handleDeleteContext"
        @close="closeContextDialog"
      />

      <!-- Article Display -->
      <YourDisplayComponent
        :articleStatus="articleStatus"
        :formattedArticles="formattedArticles"
        :isRequesting="isPending"
        :isLocked="isLocked"
        @request-writeup="showConfirmationDialog = true"
      />
    </div>
  </div>
</template>
```

### Script Setup Structure

```typescript
<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import type { FlattenedArticle, FormattedArticle } from "@/types/ArticleTypes";
import { requestArticleGenerationAction } from "@/store/aiArticles/actions";
import { useArticleStatus } from "@/composables/aiArticles/useArticleStatus";
import { INTERVAL_MS } from "@/constants/articleConstants";

// Props
const props = defineProps<{
  articles: FlattenedArticle[];
  copyID?: string;
  accountId?: string | number;
  renderId?: string | number;
}>();

// Route params
const route = useRoute();
const accountId = () => Number(route.params.accountid) || null;
const renderId = () => Number(route.params.renderid) || null;
const articleId = () => {
  // Extract from articles or props
  return props.articles[0]?.id || null;
};

// Composables
const { formattedArticles, hasArticle, isFirstResultForArticle, formatPromptData } =
  useArticleFormatting(articles);
const { articleStatus, articlePhase } = useArticleStatus(hasArticle, feedbackCount);
const {
  showContextDialog,
  contextText,
  onAddContext,
  handleSaveContext,
  handleDeleteContext,
  fetchExistingContext
} = useArticleContext(accountId, renderId, articleId);

// State
const isPending = computed(() => articleStatus.value === "pending");
const isLocked = computed(() => articlePhase.value === "locked");

// Methods
async function handleRequestWriteup() {
  // Trigger article generation
}

// Lifecycle
onMounted(() => {
  // Initialize data
});

onUnmounted(() => {
  // Cleanup (clear intervals, etc.)
});
</script>
```

### Key Responsibilities

1. **Props Management**: Receives `articles`, `copyID`, `accountId`, `renderId` from parent
2. **Route Integration**: Extracts IDs from route params
3. **Composable Coordination**: Uses multiple composables for different concerns
4. **UI State Management**: Manages loading, error, success states
5. **Event Handling**: Handles user interactions (buttons, forms, etc.)
6. **API Integration**: Calls store actions for API operations
7. **Lifecycle Management**: Handles polling, cleanup, initialization

---

## Composables Pattern

Composables encapsulate **business logic** and **state management**. They follow this pattern:

### Structure

```typescript
import { computed, ref, type Ref } from "vue";
import type { YourDataType } from "@/types/YourTypes";
import { yourApiAction } from "@/store/aiArticles/actions";

/**
 * Composable for [purpose]
 * @param param1 - Description
 * @param param2 - Description
 * @returns Object with state, computed properties, and methods
 */
export function useYourComposable(
  param1: Ref<SomeType>,
  param2: () => number | null
) {
  // State
  const state1 = ref<Type>(initialValue);
  const state2 = ref<Type>(initialValue);
  const error = ref("");
  const isLoading = ref(false);

  // Computed properties
  const computedValue = computed(() => {
    // Logic
    return result;
  });

  // Methods
  async function loadData() {
    isLoading.value = true;
    error.value = "";
    try {
      // API call
      await yourApiAction(accountId, renderId, articleId);
      // Update state
    } catch (err) {
      error.value = "Error message";
    } finally {
      isLoading.value = false;
    }
  }

  function handleAction() {
    // Logic
  }

  // Return public API
  return {
    // State
    state1,
    state2,
    error,
    isLoading,
    // Computed
    computedValue,
    // Methods
    loadData,
    handleAction,
  };
}
```

### Example: `useFixtureEditing.ts`

```typescript
export function useFixtureEditing(
  articles: Ref<FlattenedArticle[]>,
  accountId: () => number | null,
  renderId: () => number | null,
  articleId: () => number | null
) {
  // State
  const isEditingFixtures = ref(false);
  const fixtures = ref<ParsedFixturePrompt[]>([]);
  const unsavedChanges = ref<Set<number>>(new Set());
  const isSavingFixtures = ref(false);
  const fixtureError = ref("");

  // Computed
  const hasUnsavedChanges = computed(() => unsavedChanges.value.size > 0);

  // Methods
  function loadFixtures() {
    // Extract fixtures from articles
  }

  async function onSaveAllChanges() {
    // Save all changed fixtures
  }

  return {
    isEditingFixtures,
    fixtures,
    unsavedChanges,
    hasUnsavedChanges,
    loadFixtures,
    onSaveAllChanges,
    // ... more exports
  };
}
```

### Composable Guidelines

1. **Single Responsibility**: Each composable handles one concern
2. **Reactive State**: Use `ref` for primitive values, `reactive` for objects
3. **Computed Properties**: Use for derived state
4. **Error Handling**: Always include error state and try/catch blocks
5. **Loading States**: Track async operation status
6. **Public API**: Return only what the component needs
7. **Type Safety**: Use TypeScript interfaces for all types

---

## Components Pattern

Components are **presentational** and handle UI rendering. They follow this pattern:

### Structure

```vue
<template>
  <div class="your-component">
    <!-- UI content -->
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-text-field
          :model-value="modelValue"
          @update:model-value="$emit('update:modelValue', $event)"
          :rules="validationRules"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { YourType } from "@/types/YourTypes";

// Props
const props = defineProps<{
  modelValue: string;
  title: string;
  validationRules?: Array<(value: any) => boolean | string>;
}>();

// Emits
const emit = defineEmits<{
  "update:modelValue": [value: string];
  save: [];
  cancel: [];
}>();

// Local state (if needed)
const localState = ref("");

// Computed (if needed)
const computedValue = computed(() => {
  // Logic
});
</script>
```

### Component Guidelines

1. **Props Down, Events Up**: Use props for data, emits for actions
2. **v-model Support**: Use `modelValue` prop and `update:modelValue` emit
3. **Validation**: Accept `validationRules` prop for form validation
4. **Styling**: Use Vuetify components and classes
5. **Accessibility**: Include proper labels, tooltips, ARIA attributes
6. **Error Display**: Show validation errors inline
7. **Loading States**: Show loading indicators for async operations

### Example: `FixtureList.vue`

```vue
<template>
  <div class="fixture-list" style="max-height: 600px; overflow-y: auto;">
    <SearchSortControls
      v-model:searchQuery="searchQuery"
      v-model:sortBy="sortBy"
      v-model:sortOrder="sortOrder"
      :filteredCount="filteredAndSortedFixtures.length"
      :totalCount="fixtures.length"
    />

    <div v-if="error" class="error-message">{{ error }}</div>

    <template
      v-for="(fixture, index) in filteredAndSortedFixtures"
      :key="index"
    >
      <v-card
        class="mb-2"
        :class="{
          'bg-surface-lighten1': !getFixtureSummary(
            fixture,
            index,
            unsavedChanges
          ).hasUnsavedChanges,
        }"
      >
        <v-card-title>
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h6">
                {{ getFixtureSummary(fixture, index, unsavedChanges).homeTeam }}
                vs
                {{ getFixtureSummary(fixture, index, unsavedChanges).awayTeam }}
              </div>
              <div class="text-caption">
                {{ getFixtureSummary(fixture, index, unsavedChanges).ageGroup }}
                - {{ getFixtureSummary(fixture, index, unsavedChanges).grade }}
              </div>
            </div>
            <IconButton
              icon="mdi-pencil"
              tooltip="Edit fixture"
              size="small"
              color="success"
              @click="$emit('edit-fixture', index)"
            />
          </div>
        </v-card-title>
      </v-card>
      <v-divider v-if="index < filteredAndSortedFixtures.length - 1" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ParsedFixturePrompt } from "@/types/FixtureTypes";
import { getFixtureSummary } from "../_utils/fixtureHelpers";

defineProps<{
  fixtures: ParsedFixturePrompt[];
  filteredAndSortedFixtures: ParsedFixturePrompt[];
  unsavedChanges: Set<number>;
  error?: string;
  getFixtureSummary: typeof getFixtureSummary;
}>();

defineEmits<{
  "edit-fixture": [index: number];
}>();
</script>
```

---

## Utils Pattern

Utils contain **pure functions** for data manipulation. They follow this pattern:

### Structure

```typescript
import type { YourType } from "@/types/YourTypes";

/**
 * Function description
 * @param param1 - Description
 * @param param2 - Description
 * @returns Description
 */
export function yourHelperFunction(
  param1: YourType,
  param2: number
): ReturnType {
  // Pure function logic
  return result;
}

/**
 * Parse data from string format
 */
export function parseYourData(data: string): ParsedType {
  // Parsing logic
  return parsed;
}

/**
 * Stringify data to string format
 */
export function stringifyYourData(data: YourType): string {
  // Stringification logic
  return stringified;
}
```

### Example: `fixtureHelpers.ts`

```typescript
import type { ParsedFixturePrompt } from "@/types/FixtureTypes";

export function getFixtureSummary(
  fixture: ParsedFixturePrompt,
  index: number,
  unsavedChanges: Set<number>
) {
  const data = fixture.parsedData;
  return {
    index: index + 1,
    competition: data.matchContext.competition,
    grade: data.matchContext.grade,
    homeTeam: data.homeTeam.teamName,
    awayTeam: data.awayTeam.teamName,
    hasUnsavedChanges: unsavedChanges.has(index),
  };
}
```

### Utils Guidelines

1. **Pure Functions**: No side effects, same input → same output
2. **Type Safety**: Use TypeScript types for all parameters and returns
3. **Documentation**: JSDoc comments for all functions
4. **Single Purpose**: Each function does one thing
5. **Testable**: Easy to unit test
6. **Reusable**: Can be used across multiple components/composables

---

## Integration with AssetDisplayArticle

Article types are registered in `AssetDisplayArticle.vue`:

### Registration

```typescript
// AssetDisplayArticle.vue
import WeekendWrapUp from "./articleTypes/WeekendWrapUp.vue";
import Top5Listicle from "./articleTypes/Top5Listicle.vue";
import LadderSummary from "./articleTypes/LadderSummary.vue";
import UpcomingFixtures from "./articleTypes/UpcomingFixtures.vue";
import YourArticleType from "./articleTypes/YourArticleType.vue";

const assetComponent = computed(() => {
  switch (assetType.value) {
    case "CricketResults":
      return WeekendWrapUp;
    case "Top5Listicle":
      return Top5Listicle;
    case "LadderSummary":
      return LadderSummary;
    case "UpcomingFixtures":
      return UpcomingFixtures;
    case "YourAssetType":
      return YourArticleType;
    default:
      return null;
  }
});
```

### Props Passed

The parent component passes these props to article type components:

```typescript
<component
  :is="assetComponent"
  :articles="Array.isArray(articles) ? articles : []"
  :copyID="generateCopyID()"
  ref="articleComponent"
  :accountId="route.params.accountid"
  :renderId="route.params.renderid"
/>
```

### Required Interface

Article type components should implement the `ArticleComponent` interface:

```typescript
export interface ArticleComponent {
  copyArticle?: () => void;
  // Add other required methods if needed
}
```

---

## Step-by-Step: Building a New Article Type

Follow these steps to create a new article type:

### Step 1: Create Main Component

1. Create `YourArticleType.vue` in `articleTypes/`
2. Set up basic template with conditional rendering
3. Import necessary composables and components
4. Set up props and route integration

```vue
<template>
  <div class="pa-4 text-body" :id="copyID">
    <!-- Your UI here -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import type { FlattenedArticle } from "@/types/ArticleTypes";

const props = defineProps<{
  articles: FlattenedArticle[];
  copyID?: string;
  accountId?: string | number;
  renderId?: string | number;
}>();

const route = useRoute();
const accountId = () => Number(route.params.accountid) || null;
const renderId = () => Number(route.params.renderid) || null;
</script>
```

### Step 2: Create Composables

1. Create `_composables/useYourDataEditing.ts` for CRUD operations
2. Create `_composables/useYourValidation.ts` for form validation
3. Create `_composables/useYourSearchSort.ts` if search/filter is needed

```typescript
// _composables/useYourDataEditing.ts
export function useYourDataEditing(
  articles: Ref<FlattenedArticle[]>,
  accountId: () => number | null,
  renderId: () => number | null,
  articleId: () => number | null
) {
  // State, computed, methods
  return {
    // Public API
  };
}
```

### Step 3: Create Components

1. Create `_components/YourCustomSection.vue` for form sections
2. Create `_components/YourList.vue` for list views
3. Create `_components/YourDisplay.vue` for article display (if needed)

```vue
<!-- _components/YourCustomSection.vue -->
<template>
  <div>
    <!-- Your UI -->
  </div>
</template>

<script setup lang="ts">
defineProps<{
  // Props
}>();

defineEmits<{
  // Emits
}>();
</script>
```

### Step 4: Create Utils

1. Create `_utils/yourHelpers.ts` for data manipulation
2. Add helper functions for parsing, stringifying, formatting

```typescript
// _utils/yourHelpers.ts
export function parseYourData(data: string): ParsedType {
  // Logic
}

export function formatYourData(data: YourType): string {
  // Logic
}
```

### Step 5: Integrate with AssetDisplayArticle

1. Import your component in `AssetDisplayArticle.vue`
2. Add case in `assetComponent` computed property
3. Map your asset type name to the component

```typescript
import YourArticleType from "./articleTypes/YourArticleType.vue";

const assetComponent = computed(() => {
  switch (assetType.value) {
    case "YourAssetType":
      return YourArticleType;
    // ...
  }
});
```

### Step 6: Create Documentation

1. Create/update `readMe.md` in your article type folder
2. Create/update `readMe.md` in `_components/`
3. Create/update `readMe.md` in `_composables/`
4. Create/update `readMe.md` in `_utils/`

---

## Common Patterns & Best Practices

### 1. Article Generation Workflow

```typescript
// Request article generation
async function handleRequestWriteup() {
  isRequesting.value = true;
  try {
    await requestArticleGenerationAction(accountId(), renderId());
    // Polling will handle status updates
  } catch (error) {
    // Handle error
  } finally {
    isRequesting.value = false;
  }
}

// Polling for status updates
let pollInterval: NodeJS.Timeout | null = null;

function startPolling() {
  pollInterval = setInterval(async () => {
    // Fetch article status
    await fetchArticleStatus();
  }, INTERVAL_MS); // 5000ms = 5 seconds
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

onMounted(() => {
  if (isPending.value) {
    startPolling();
  }
});

onUnmounted(() => {
  stopPolling();
});
```

### 2. Form Validation

```typescript
// useYourValidation.ts
export const requiredRule: ValidationRule = (value: any) => {
  return !!value || "This field is required";
};

export const emailRule: ValidationRule = (value: string) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value) || "Invalid email format";
};

// In component
const { requiredRule, emailRule } = useYourValidation();

<v-text-field
  :model-value="email"
  @update:model-value="email = $event"
  :rules="[requiredRule, emailRule]"
/>
```

### 3. Search and Filter

```typescript
// useYourSearchSort.ts
export function useYourSearchSort(items: Ref<YourType[]>) {
  const searchQuery = ref("");
  const sortBy = ref<keyof YourType>("name");
  const sortOrder = ref<"asc" | "desc">("asc");

  const filteredAndSortedItems = computed(() => {
    let filtered = items.value.filter((item) => {
      const query = searchQuery.value?.trim().toLowerCase() || "";
      if (!query) return true;
      // Search logic
      return item.name.toLowerCase().includes(query);
    });

    // Sort logic
    filtered.sort((a, b) => {
      const aVal = a[sortBy.value];
      const bVal = b[sortBy.value];
      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return sortOrder.value === "asc" ? comparison : -comparison;
    });

    return filtered;
  });

  return {
    searchQuery,
    sortBy,
    sortOrder,
    filteredAndSortedItems,
  };
}
```

### 4. Unsaved Changes Tracking

```typescript
// Track changes
const originalData = ref<YourType[]>([]);
const unsavedChanges = ref<Set<number>>(new Set());

function loadData() {
  originalData.value = cloneDeep(currentData.value);
  unsavedChanges.value.clear();
}

function markAsChanged(index: number) {
  unsavedChanges.value.add(index);
}

function clearChanges() {
  unsavedChanges.value.clear();
  originalData.value = cloneDeep(currentData.value);
}

const hasUnsavedChanges = computed(() => unsavedChanges.value.size > 0);
```

### 5. Error Handling

```typescript
// In composable
const error = ref("");

async function saveData() {
  error.value = "";
  try {
    await saveApiCall();
  } catch (err: any) {
    error.value = err.message || "An error occurred";
    console.error("Save error:", err);
  }
}

// In component
<div v-if="error" class="text-error">
  {{ error }}
</div>;
```

### 6. Loading States

```typescript
// In composable
const isLoading = ref(false);

async function loadData() {
  isLoading.value = true;
  try {
    // Load data
  } finally {
    isLoading.value = false;
  }
}

// In component
<v-progress-circular v-if="isLoading" indeterminate />
<IconButton :loading="isLoading" :disabled="isLoading" />
```

### 7. Deep Cloning for Comparison

```typescript
import { cloneDeep } from "lodash-es";

const original = ref<YourType>({});
const current = ref<YourType>({});

function startEditing() {
  original.value = cloneDeep(current.value);
}

function hasChanges(): boolean {
  return JSON.stringify(original.value) !== JSON.stringify(current.value);
}
```

---

## Data Flow Examples

### Example 1: Loading Fixtures from Articles

```typescript
// useFixtureEditing.ts
function loadFixtures() {
  if (!articles.value || articles.value.length === 0) return;

  const firstArticle = articles.value[0];
  const articleDataForPrompt = firstArticle.ArticleDataForPrompt;

  if (!articleDataForPrompt) return;

  // Parse fixtures from article data
  const parsed = parseFixturePrompt(articleDataForPrompt);
  fixtures.value = parsed;
  originalFixtures.value = cloneDeep(parsed);
}
```

### Example 2: Saving Changes to API

```typescript
// useFixtureEditing.ts
async function onSaveAllChanges() {
  isSavingFixtures.value = true;
  fixtureError.value = "";

  try {
    // Prepare payload
    const changedFixtures = Array.from(unsavedChanges.value).map((index) => {
      return {
        original: originalFixtures.value[index],
        updated: fixtures.value[index],
      };
    });

    // Call API action
    await updateArticleFixturesAction(
      accountId(),
      renderId(),
      articleId(),
      changedFixtures
    );

    // Update original data
    originalFixtures.value = cloneDeep(fixtures.value);
    unsavedChanges.value.clear();
  } catch (error: any) {
    fixtureError.value = error.message || "Failed to save fixtures";
  } finally {
    isSavingFixtures.value = false;
  }
}
```

### Example 3: Adding Context

```typescript
// useArticleContext.ts
async function handleSaveContext() {
  isSavingContext.value = true;
  contextError.value = "";
  contextSuccess.value = "";

  try {
    await saveArticleContextAction(
      accountId(),
      renderId(),
      articleId(),
      contextText.value
    );

    contextSuccess.value = "Context saved successfully";
    hasContext.value = true;

    // Close dialog after delay
    setTimeout(() => {
      showContextDialog.value = false;
    }, 1500);
  } catch (error: any) {
    contextError.value = error.message || "Failed to save context";
  } finally {
    isSavingContext.value = false;
  }
}
```

---

## Summary

### Key Takeaways

1. **Main Component**: Orchestrates workflow, manages UI state, coordinates composables
2. **Composables**: Encapsulate business logic, state management, API calls
3. **Components**: Presentational UI, props down / events up
4. **Utils**: Pure functions for data manipulation
5. **Integration**: Register in `AssetDisplayArticle.vue` with asset type mapping

### Migration Checklist

When migrating another article type to this pattern:

- [ ] Create main component with proper structure
- [ ] Extract business logic into composables
- [ ] Create reusable UI components
- [ ] Add utility functions for data manipulation
- [ ] Integrate with `AssetDisplayArticle.vue`
- [ ] Create/update `readMe.md` files
- [ ] Add TypeScript types/interfaces
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test all functionality

---

## References

- **Main Examples**:
  - `WeekendWrapUp.vue` - Full implementation with fixture editing and all patterns
  - `Top5Listicle.vue` - Simple article type with context management
  - `LadderSummary.vue` - Simple article type with context management
  - `UpcomingFixtures.vue` - Simple article type with context management
- **Composables**:
  - `_composables/useFixtureEditing.ts` - Fixture CRUD operations (WeekendWrapUp only)
  - `_composables/useArticleContext.ts` - Context management (all types)
  - `_composables/useArticleFormatting.ts` - WeekendWrapUp formatting
  - `_composables/useTop5Formatting.ts` - Top5Listicle formatting
  - `_composables/useLadderFormatting.ts` - LadderSummary formatting
  - `_composables/useUpcomingFixturesFormatting.ts` - UpcomingFixtures formatting
- **Components**:
  - `_components/FixtureList.vue` - Fixture list with responsive min-height and text wrapping
  - `_components/FixtureEditForm.vue` - Fixture edit form (WeekendWrapUp only)
  - `_components/ArticleDisplay.vue` - WeekendWrapUp article display
  - `_components/Top5Display.vue` - Top5Listicle article display
  - `_components/LadderDisplay.vue` - LadderSummary article display
  - `_components/UpcomingFixturesDisplay.vue` - UpcomingFixtures article display
  - `_components/ContextDialog.vue` - Context management dialog (all types)
- **Utils**: `_utils/fixtureHelpers.ts`
- **Integration**: `AssetDisplayArticle.vue`
- **Types**: `@/types/ArticleTypes.ts`, `@/types/FixtureTypes.ts`
- **Store**: `@/store/aiArticles/actions.ts`, `@/store/aiArticles/service.ts`
