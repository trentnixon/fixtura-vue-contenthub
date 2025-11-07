import { AiArticle, FormattedAiArticle } from "@/types";
import { usePrivateAiArticleState } from "./private";
import {
  fetchAiArticleFromService,
  fetchAiArticlesByRenderIdFromService,
  triggerWeekendArticleFromService,
  fetchWeekendArticleStatusFromService,
  fetchWeekendArticleDownloadFromService,
  saveArticleContext,
  fetchArticleContext,
  deleteArticleContext,
  fetchArticleFixtures,
  updateArticleFixtures,
  type SaveContextResponse,
  type FetchContextResponse,
  type DeleteContextResponse,
  type UpdateFixturesResponse,
} from "./service";

export async function fetchAiArticle(id: number) {
  const state = usePrivateAiArticleState();
  try {
    state.loading = true;
    const response = await fetchAiArticleFromService(id);
    if (response && response.data) {
      state.aiArticle = response.data;
      //console.log("Fetched AI Article details:", state.aiArticle);
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchAiArticlesByRenderId(renderId: number) {
  const state = usePrivateAiArticleState();
  try {
    state.loading = true;
    const response = await fetchAiArticlesByRenderIdFromService(renderId);
    if (response && response.data) {
      state.aiArticlesByRenderID = response.data;
    } else {
      throw new Error("Invalid data structure");
    }
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

export async function fetchFullAiArticlesByIds(ids: number[]) {
  const state = usePrivateAiArticleState();

  try {
    state.loading = true;

    // Fetch all AI articles in parallel
    const responses = await Promise.all(
      ids.map((id) => fetchAiArticleFromService(id))
    );

    // Store each formatted article by its ID
    responses.forEach((response) => {
      if (response && response.data) {
        const rawArticle = response.data as AiArticle;
        const item = formatAiArticles(rawArticle);
        // Format the article and store it in the state
        state.fullAiArticles[response.data.id] = item;
      }
    });
  } catch (error) {
    state.error = (error as Error).message;
  } finally {
    state.loading = false;
  }
}

// Trigger AI weekend article creation
export async function triggerWeekendArticleAction(payload: {
  accountId: number;
  renderId: number;
  articleId: number;
}) {
  const state = usePrivateAiArticleState();
  try {
    state.loading = true;
    state.error = null;
    state.status = "pending";
    state.jobId = null; // No longer used, but keeping for compatibility
    state.articleId = payload.articleId;

    const res = await triggerWeekendArticleFromService(payload);
    if (res.data) {
      // Backward compatibility: treat null status as "waiting"
      state.status = res.data.status ?? "waiting";
      // Store articleId from payload since it's already known
      state.articleId = payload.articleId;
    }
    return res; // Return response for UI display
  } catch (error) {
    state.error = (error as Error).message;
    state.status = "failed";
    throw error; // Re-throw so component can handle
  } finally {
    state.loading = false;
  }
}

// Poll current status with accountId, renderId, articleId
export async function pollWeekendArticleStatus(payload: {
  accountId: number;
  renderId: number;
  articleId: number;
}) {
  const state = usePrivateAiArticleState();
  try {
    const res = await fetchWeekendArticleStatusFromService(payload);
    console.log("[pollWeekendArticleStatus] API Response:", {
      status: res.data?.status,
      statusType: typeof res.data?.status,
      statusIsNull: res.data?.status === null,
      fullResponse: res.data,
    });

    if (res.data) {
      // Backward compatibility: treat null status as "waiting"
      state.status = res.data.status ?? "waiting";
      state.articleId = payload.articleId; // Already known from payload

      console.log("[pollWeekendArticleStatus] Store State Updated:", {
        status: state.status,
        articleId: state.articleId,
        apiStatus: res.data.status,
      });

      // Handle locked state or other error conditions
      if (res.data.locked) {
        state.error =
          "Article is locked (feedback limit reached or article too old)";
      }

      if (res.data.status === "failed") {
        state.error = "Article generation failed";
      }
    }
    return res;
  } catch (error) {
    // Handle errors - don't set status to "failed" for 400/404 errors
    // (legacy articles may not support status API, but legacy detection is now date-based)
    const errorMessage = (error as Error).message;
    state.error = errorMessage;

    console.log("[pollWeekendArticleStatus] Error Caught:", {
      errorMessage,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      currentStatus: state.status,
    });

    // Check if error suggests the endpoint doesn't exist or isn't supported
    const isNotFoundError =
      errorMessage.includes("404") ||
      errorMessage.includes("Not Found") ||
      errorMessage.includes("not found");

    const isBadRequestError =
      errorMessage.includes("400") ||
      errorMessage.includes("Bad Request") ||
      errorMessage.includes("bad request");

    const isEndpointError = isNotFoundError || isBadRequestError;

    console.log("[pollWeekendArticleStatus] Error Analysis:", {
      isNotFoundError,
      isBadRequestError,
      isEndpointError,
      errorMessage,
      statusCode: errorMessage.match(/\d{3}/)?.[0],
    });

    if (isEndpointError) {
      // 404/400 - endpoint doesn't exist or not supported
      // Don't set status to "failed", keep current status (legacy detection is date-based now)
      console.log(
        "[pollWeekendArticleStatus] Endpoint error (400/404) - preserving status:",
        {
          currentStatus: state.status,
        }
      );
    } else {
      // Real error, set to failed
      state.status = "failed";
      console.log("[pollWeekendArticleStatus] Treated as Failed:", {
        status: state.status,
      });
    }

    throw error;
  }
}

// Optionally fetch completed article data
export async function fetchWeekendArticleDownload(articleId: number) {
  return await fetchWeekendArticleDownloadFromService(articleId);
}

// ============================================================
// Context Actions
// ============================================================
// Actions for managing article context via CMS API

/**
 * Save/update article context
 * POST /ai-article/context
 */
export async function saveArticleContextAction(payload: {
  accountId: number;
  renderId: number;
  articleId: number;
  context: string;
}): Promise<SaveContextResponse> {
  const state = usePrivateAiArticleState();
  try {
    state.loading = true;
    state.error = null;

    const response = await saveArticleContext(payload);
    return response;
  } catch (error) {
    state.error = (error as Error).message;
    throw error;
  } finally {
    state.loading = false;
  }
}

/**
 * Fetch existing article context
 * POST /ai-article/context (without 'context' field triggers fetch mode)
 */
export async function fetchArticleContextAction(payload: {
  accountId: number;
  renderId: number;
  articleId: number;
}): Promise<FetchContextResponse> {
  const state = usePrivateAiArticleState();
  try {
    // Don't set loading state for fetch (optional, can be set if needed)
    const response = await fetchArticleContext(payload);
    return response;
  } catch (error) {
    state.error = (error as Error).message;
    throw error;
  }
}

/**
 * Delete article context
 * DELETE /ai-article/context
 */
export async function deleteArticleContextAction(payload: {
  accountId: number;
  renderId: number;
  articleId: number;
}): Promise<DeleteContextResponse> {
  const state = usePrivateAiArticleState();
  try {
    state.loading = true;
    state.error = null;

    const response = await deleteArticleContext(payload);
    return response;
  } catch (error) {
    state.error = (error as Error).message;
    throw error;
  } finally {
    state.loading = false;
  }
}

// ============================================================
// Fixture Update Actions
// ============================================================

/**
 * Fetch article fixtures
 * Note: Currently not implemented as a separate endpoint - fixtures are loaded
 * directly from the article's ArticleDataForPrompt field.
 */
export async function fetchArticleFixturesAction(payload: {
  accountId: number;
  renderId: number;
  articleId: number;
}): Promise<{ data: { fixtures: { prompt: string }[] } }> {
  const state = usePrivateAiArticleState();
  try {
    state.loading = true;
    state.error = null;

    const response = await fetchArticleFixtures(payload);
    return response;
  } catch (error) {
    state.error = (error as Error).message;
    throw error;
  } finally {
    state.loading = false;
  }
}

/**
 * Update article fixtures
 * POST /ai-article/fixtures
 *
 * Updates the articleDataForPrompt array for a specific article.
 * Performs a full replacement of all fixtures - partial updates are not supported.
 */
export async function updateArticleFixturesAction(payload: {
  accountId: number;
  renderId: number;
  articleId: number;
  fixtures: { prompt: string }[];
}): Promise<UpdateFixturesResponse> {
  const state = usePrivateAiArticleState();
  try {
    state.loading = true;
    state.error = null;

    const response = await updateArticleFixtures(payload);
    return response;
  } catch (error: any) {
    // Handle error based on API spec error format
    const errorMessage =
      error?.response?.data?.error?.message ||
      error?.response?.data?.error?.details ||
      error?.message ||
      "Failed to update fixtures";
    state.error = errorMessage;
    throw new Error(errorMessage);
  } finally {
    state.loading = false;
  }
}

function formatAiArticles(fullAiArticle: AiArticle): FormattedAiArticle {
  const id = fullAiArticle.id;

  // Extract all necessary fields, falling back to default values if not present
  const articleName = fullAiArticle.attributes?.Name || "Unknown Article";
  const groupingCategory =
    fullAiArticle.attributes?.grouping_category || "Unknown Category";
  const articleJournalist =
    fullAiArticle.attributes?.ArticleJournalist || "Unknown Journalist";
  const articleEditor =
    fullAiArticle.attributes?.ArticleEditor || "Unknown Editor";
  const hasBias = fullAiArticle.attributes?.hasBias || "None";
  const openAiID = fullAiArticle.attributes?.openAiID || "Unknown ID";
  const openAiCreated = fullAiArticle.attributes?.openAiCreated || 0;
  const openAiPrompt_tokens =
    fullAiArticle.attributes?.openAiPrompt_tokens || 0;
  const openAiCompletionTokens =
    fullAiArticle.attributes?.openAiCompletionTokens || 0;
  const structuredOutput =
    fullAiArticle.attributes?.structuredOutput || "Unknown";
  const openAiTotalTokens = fullAiArticle.attributes?.openAiTotalTokens || 0;
  const hasCompleted = fullAiArticle.attributes?.hasCompleted || false;
  const forceRerender = fullAiArticle.attributes?.forceRerender || false;
  const hasError = fullAiArticle.attributes?.hasError || false;
  const assetLinkID = fullAiArticle.attributes?.assetLinkID || "Unknown";
  const publishedAt = fullAiArticle.attributes?.publishedAt || "Unknown Date";
  const createdAt = fullAiArticle.attributes?.createdAt || "Unknown Date";

  return {
    id,
    attributes: {
      Name: articleName,
      grouping_category: groupingCategory,
      ArticleJournalist: articleJournalist,
      ArticleEditor: articleEditor,
      hasBias,
      openAiID,
      openAiCreated,
      openAiPrompt_tokens,
      openAiCompletionTokens,
      openAiTotalTokens,
      hasCompleted,
      forceRerender,
      hasError,
      assetLinkID,
      publishedAt,
      createdAt,
      structuredOutput,
      asset_type: fullAiArticle.attributes?.asset_type || {
        data: { attributes: { Name: "Unknown" } },
      },
      asset_category: fullAiArticle.attributes?.asset_category || {
        data: { attributes: { Name: "Unknown", Identifier: "Unknown" } },
      },
      asset: fullAiArticle.attributes?.asset || {
        data: { attributes: { Name: "Unknown", CompositionID: "Unknown" } },
      },
    },
  };
}
