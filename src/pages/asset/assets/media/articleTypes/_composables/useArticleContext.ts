import { computed, ref } from "vue";
import {
  saveArticleContextAction,
  fetchArticleContextAction,
  deleteArticleContextAction,
} from "@/store/aiArticles/actions";

const CONTEXT_MAX_LENGTH = 1000; // Character limit for context

/**
 * Composable for managing article context (CRUD operations)
 */
export function useArticleContext(
  accountId: () => number | null,
  renderId: () => number | null,
  articleId: () => number | null
) {
  // Context state
  const showContextDialog = ref(false);
  const contextText = ref("");
  const isSavingContext = ref(false);
  const contextError = ref("");
  const contextSuccess = ref("");
  const hasContext = ref(false);

  // Context computed properties
  const contextCharCount = computed(() => contextText.value.length);
  const contextCharRemaining = computed(() => CONTEXT_MAX_LENGTH - contextCharCount.value);
  const isContextValid = computed(() => {
    return contextText.value.trim().length > 0 && contextCharCount.value <= CONTEXT_MAX_LENGTH;
  });
  const contextCharCountClass = computed(() => {
    const remaining = contextCharRemaining.value;
    if (remaining < 50) return "text-error";
    if (remaining < 100) return "text-warning";
    return "text-grey";
  });

  // Cancel button label - changes to "Close" when context exists or after successful save
  const cancelButtonLabel = computed(() => {
    return hasContext.value || contextSuccess.value ? "Close" : "Cancel";
  });

  /**
   * Open context dialog and fetch existing context
   */
  async function onAddContext() {
    showContextDialog.value = true;
    contextError.value = "";
    contextSuccess.value = "";
    await fetchExistingContext();
  }

  /**
   * Fetch existing context from CMS
   */
  async function fetchExistingContext() {
    const accountIdValue = accountId();
    const renderIdValue = renderId();
    const articleIdValue = articleId();

    if (!accountIdValue || !renderIdValue || !articleIdValue) {
      console.warn("Cannot fetch context: missing required IDs");
      return;
    }

    try {
      const response = await fetchArticleContextAction({
        accountId: accountIdValue,
        renderId: renderIdValue,
        articleId: articleIdValue,
      });

      if (response.data?.context) {
        contextText.value = response.data.context;
        hasContext.value = true;
      } else {
        contextText.value = "";
        hasContext.value = false;
      }
    } catch (error: any) {
      console.error("Failed to fetch context:", error);
      // Don't show error on fetch failure (context might not exist yet)
    }
  }

  /**
   * Close context dialog
   */
  function closeContextDialog() {
    if (!isSavingContext.value) {
      showContextDialog.value = false;
      contextError.value = "";
      contextSuccess.value = "";
      // Don't clear contextText here - keep it for next time dialog opens
    }
  }

  /**
   * Save context to CMS
   */
  async function handleSaveContext() {
    const accountIdValue = accountId();
    const renderIdValue = renderId();
    const articleIdValue = articleId();

    if (!accountIdValue || !renderIdValue || !articleIdValue) {
      contextError.value = "Missing required IDs";
      return;
    }

    if (!isContextValid.value) {
      contextError.value = "Context must not be empty and within character limit";
      return;
    }

    isSavingContext.value = true;
    contextError.value = "";
    contextSuccess.value = "";

    try {
      const response = await saveArticleContextAction({
        accountId: accountIdValue,
        renderId: renderIdValue,
        articleId: articleIdValue,
        context: contextText.value.trim(),
      });

      if (response.data?.success) {
        hasContext.value = true;
        contextSuccess.value = "Context saved successfully! It will be used in future article generations.";

        // Clear success message after 3 seconds
        setTimeout(() => {
          contextSuccess.value = "";
        }, 3000);
      }
    } catch (error: any) {
      contextError.value = error?.message || "Failed to save context. Please try again.";
    } finally {
      isSavingContext.value = false;
    }
  }

  /**
   * Delete context from CMS
   */
  async function handleDeleteContext() {
    if (!hasContext.value) return;

    // Show confirmation
    if (!confirm("Are you sure you want to delete the context? This cannot be undone.")) {
      return;
    }

    const accountIdValue = accountId();
    const renderIdValue = renderId();
    const articleIdValue = articleId();

    if (!accountIdValue || !renderIdValue || !articleIdValue) {
      contextError.value = "Missing required IDs";
      return;
    }

    isSavingContext.value = true;
    contextError.value = "";
    contextSuccess.value = "";

    try {
      const response = await deleteArticleContextAction({
        accountId: accountIdValue,
        renderId: renderIdValue,
        articleId: articleIdValue,
      });

      if (response.data?.success) {
        contextText.value = "";
        hasContext.value = false;
        contextSuccess.value = "Context deleted successfully.";

        // Clear success message and close dialog after 1.5 seconds
        setTimeout(() => {
          contextSuccess.value = "";
          closeContextDialog();
        }, 1500);
      }
    } catch (error: any) {
      contextError.value = error?.message || "Failed to delete context. Please try again.";
    } finally {
      isSavingContext.value = false;
    }
  }

  return {
    // State
    showContextDialog,
    contextText,
    isSavingContext,
    contextError,
    contextSuccess,
    hasContext,
    CONTEXT_MAX_LENGTH,

    // Computed
    contextCharCount,
    contextCharRemaining,
    isContextValid,
    contextCharCountClass,
    cancelButtonLabel,

    // Methods
    onAddContext,
    fetchExistingContext,
    closeContextDialog,
    handleSaveContext,
    handleDeleteContext,
  };
}

