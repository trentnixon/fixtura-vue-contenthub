# AI Articles Composables

This directory contains reusable Vue 3 composables for managing AI article functionality. These composables extract business logic from components, making code more maintainable, testable, and reusable.

## Composables

### `useArticleFeedback.ts`

Manages article feedback state and lock functionality.

**Exports:**

- `feedbackCount: Ref<number>` - Current feedback count
- `feedbackLimit: Ref<number>` - Feedback limit threshold
- `isLocked: ComputedRef<boolean>` - Whether article is locked (count >= limit)
- `updateFeedback(data: ArticleStatusData): void` - Update feedback from API response
- `resetFeedback(): void` - Reset feedback state

**Usage:**

```typescript
const { feedbackCount, feedbackLimit, isLocked, updateFeedback } =
  useArticleFeedback();
```

**When to use:**

- Any component that needs to track feedback count/limit
- Components that need to check if article is locked
- Components that receive status responses from API

---

### `useArticleStatus.ts`

Manages article status and phase detection logic.

**Exports:**

- `articleStatus: ComputedRef<ArticleStatus>` - Current article status from store
- `articlePhase: ComputedRef<ArticlePhase>` - Detected article lifecycle phase
- `previousStatus: Ref<ArticleStatus | null>` - Previous status for transition detection

**Parameters:**

- `hasArticle: Ref<boolean>` - Whether articles exist
- `feedbackCount: Ref<number>` - Current feedback count

**Phases:**

- `initial` - No article yet, feedback count is 0
- `pending` - Status is pending/writing, polling active
- `postPending` - Transitioning from pending to completed
- `articleWritten` - Article exists and is displayed

**Usage:**

```typescript
const hasArticle = computed(() => formattedArticles.value.length > 0);
const { articleStatus, articlePhase } = useArticleStatus(
  hasArticle,
  feedbackCount
);
```

**When to use:**

- Components that need to detect article lifecycle phases
- Components that need to react to status changes
- Components that need phase-based UI logic

---

### `useArticlePolling.ts`

Manages polling logic for article status updates.

**Exports:**

- `pollTimer: Ref<number | null>` - Active polling timer reference
- `pollCount: Ref<number>` - Number of polling iterations
- `isPollingActive: ComputedRef<boolean>` - Whether polling is currently active
- `startPolling(ids, onStatusUpdate, onComplete?, onError?): void` - Start polling
- `stopPolling(): void` - Stop polling and cleanup
- `resetPollCount(): void` - Reset poll count

**Parameters for `startPolling`:**

- `ids: ArticleIds` - Object with accountId, renderId, articleId
- `onStatusUpdate: (data: ArticleStatusData) => void` - Callback on each poll
- `onComplete?: () => void` - Callback when status becomes completed
- `onError?: (error: string) => void` - Callback on error

**Usage:**

```typescript
const { pollCount, isPollingActive, startPolling, stopPolling } =
  useArticlePolling();

startPolling(
  { accountId, renderId, articleId },
  (data) => {
    // Handle status update
    updateFeedback(data);
  },
  () => {
    // Handle completion
  },
  (error) => {
    // Handle error
  }
);
```

**Features:**

- Automatic cleanup on component unmount
- Timeout handling (5 minutes max)
- Status-based polling (only polls when status is "pending")
- Error handling with callbacks

**When to use:**

- Components that need to poll for article status
- Any async operation that needs polling functionality
- Components that trigger article generation

---

## Related Files

### Type Definitions

- `src/types/ArticleTypes.ts` - TypeScript interfaces and types for articles
  - `FormattedArticle` - Formatted article structure
  - `ArticleIds` - Article IDs interface
  - `ArticlePhase` - Article lifecycle phase type
  - `ArticleStatus` - Article status type
  - `updateFeedbackFromResponse()` - Helper function

### Constants

- `src/constants/articleConstants.ts` - Configuration constants
  - `POLLING_CONFIG` - Polling interval and timeout
  - `FEEDBACK_CONFIG` - Default feedback limits
  - `ARTICLE_STATUS` - Status constants

---

## Benefits of This Structure

1. **Separation of Concerns**: Business logic separated from UI components
2. **Reusability**: Composables can be used across multiple components
3. **Testability**: Logic can be tested independently of components
4. **Maintainability**: Changes to logic isolated to specific composables
5. **Type Safety**: Proper TypeScript types throughout
6. **Cleaner Components**: Components focus on UI, not business logic

---

## Migration Notes

When refactoring components to use these composables:

1. **Replace inline state** with composable exports
2. **Remove duplicate code** (e.g., feedback update logic)
3. **Update function signatures** to use composable callbacks
4. **Remove cleanup code** - composables handle it automatically
5. **Update computed properties** to use composable values

---

## Example: Before vs After

### Before (Inline Logic)

```typescript
const feedbackCount = ref(0);
const feedbackLimit = ref(5);
const isLocked = computed(() => feedbackCount.value >= feedbackLimit.value);

// Repeated in multiple places
if (typeof res.data.feedback?.count === "number") {
  feedbackCount.value = res.data.feedback.count;
}
```

### After (Using Composable)

```typescript
const { feedbackCount, feedbackLimit, isLocked, updateFeedback } =
  useArticleFeedback();

// Single call updates everything
updateFeedback(res.data);
```

---

## Future Enhancements

- [ ] Add unit tests for each composable
- [ ] Create `useArticleIds` composable for ID resolution
- [ ] Add `useArticleFormatters` for article formatting logic
- [ ] Create `useArticleValidation` for validation logic
