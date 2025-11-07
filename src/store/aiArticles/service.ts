import fetcher from "@/actions/fetcher";
import axios from "axios";
import { AiArticle } from "@/types";

interface ApiResponse<T> {
  data: T;
}

// AI Article API response shapes
export interface ArticleStatusData {
  status: "waiting" | "pending" | "writing" | "completed" | "failed";
  locked: boolean;
  feedback: {
    count: number;
    limit: number;
    remaining: number;
    canProvideFeedback: boolean;
  };
  timestamps: {
    createdAt: string;
    updatedAt: string;
    processingStartTime?: string;
    processingEndTime?: string;
    processingDuration?: number;
  };
}

export interface TriggerResponse {
  data: ArticleStatusData;
}

export interface StatusResponse {
  data: ArticleStatusData;
}

// Context API response shapes
export interface ArticleContextData {
  context: string | null;
  createdAt: string; // Always present per backend spec
  updatedAt: string; // Always present per backend spec
}

export interface SaveContextResponse {
  data: {
    success: boolean;
    context: string;
    updatedAt: string;
  };
}

export interface FetchContextResponse {
  data: ArticleContextData;
}

export interface DeleteContextResponse {
  data: {
    success: boolean;
  };
}

// Error response shape (consistent across all endpoints)
export interface ApiErrorResponse {
  error: {
    message: string;
    code: "VALIDATION_ERROR" | "NOT_FOUND" | "FORBIDDEN" | "INTERNAL_ERROR";
  };
}

// Fixture Update API response shapes
export interface UpdateFixturesResponse {
  data: {
    success: boolean;
    fixtures: { prompt: string }[];
    updatedAt: string;
  };
}

export async function fetchAiArticleFromService(
  id: number
): Promise<ApiResponse<AiArticle>> {
  const response = await fetcher.get<ApiResponse<AiArticle>>(
    `/ai-articles/${id}?populate=*`
  );
  return response;
}

const populateFields = [
  "Name",
  "asset.Name",
  "asset_type.Name",
  "asset_category.Name",
  "account.Name",
  "scheduler.Name",
  "render.Name",
  "hasCompleted",
  "forceRerender",
  "hasError",
  "structuredOutput",
  // Add or remove fields easily here
];
// Function to construct the populate query string
function constructPopulateQuery(fields: string[]): string {
  return fields.map((field, index) => `populate[${index}]=${field}`).join("&");
}

export async function fetchAiArticlesByRenderIdFromService(
  renderId: number
): Promise<ApiResponse<AiArticle[]>> {
  const baseUrl = `/ai-articles?filters[render][id][$eq]=${renderId}`;
  const populateQuery = constructPopulateQuery(populateFields);
  const fullUrl = `${baseUrl}&${populateQuery}`;

  const response = await fetcher.get<ApiResponse<AiArticle[]>>(fullUrl);
  return response;
}

// POST trigger to queue AI write-up creation
export async function triggerWeekendArticleFromService(payload: {
  accountId: number;
  renderId: number;
  articleId: number;
}): Promise<TriggerResponse> {
  const response = await fetcher.post<TriggerResponse>(
    "/ai-article/trigger",
    payload
  );
  return response;
}

// POST polling status with accountId, renderId, articleId
export async function fetchWeekendArticleStatusFromService(payload: {
  accountId: number;
  renderId: number;
  articleId: number;
}): Promise<StatusResponse> {
  const response = await fetcher.post<StatusResponse>(
    "/ai-article/status",
    payload
  );
  return response;
}

// GET completed article (dummy). Could return JSON or URL TBD
export async function fetchWeekendArticleDownloadFromService(
  articleId: number
) {
  const response = await fetcher.get<any>(`/cms/ai-articles/${articleId}`);
  return response;
}

// ============================================================
// Context Service Methods
// ============================================================
// Real API implementations for article context management

/**
 * Save/update article context
 * POST /ai-article/context
 */
export async function saveArticleContext(payload: {
  accountId: number;
  renderId: number;
  articleId: number;
  context: string;
}): Promise<SaveContextResponse> {
  const response = await fetcher.post<SaveContextResponse>(
    "/ai-article/context",
    payload
  );
  return response;
}

/**
 * Fetch existing article context
 * POST /ai-article/context (without 'context' field triggers fetch mode)
 */
export async function fetchArticleContext(payload: {
  accountId: number;
  renderId: number;
  articleId: number;
}): Promise<FetchContextResponse> {
  // Note: Backend uses POST with same endpoint, absence of 'context' field triggers fetch mode
  const response = await fetcher.post<FetchContextResponse>(
    "/ai-article/context",
    payload
  );
  return response;
}

/**
 * Delete article context
 * DELETE /ai-article/context
 */
export async function deleteArticleContext(payload: {
  accountId: number;
  renderId: number;
  articleId: number;
}): Promise<DeleteContextResponse> {
  // Use query parameters for DELETE (backend may not accept DELETE with body)
  const queryParams = new URLSearchParams({
    accountId: payload.accountId.toString(),
    renderId: payload.renderId.toString(),
    articleId: payload.articleId.toString(),
  });

  const response = await fetcher.delete<DeleteContextResponse>(
    `/ai-article/context?${queryParams.toString()}`
  );
  return response;
}

// ============================================================
// Fixture Update Service Methods
// ============================================================

/**
 * Fetch article fixtures
 * Note: Currently not implemented as a separate endpoint - fixtures are loaded
 * directly from the article's ArticleDataForPrompt field. This function is kept
 * for future use if a dedicated fetch endpoint is needed.
 */
export async function fetchArticleFixtures(_payload: {
  accountId: number;
  renderId: number;
  articleId: number;
}): Promise<{ data: { fixtures: { prompt: string }[] } }> {
  // Note: Fixtures are currently loaded from article's ArticleDataForPrompt field
  // This function is a placeholder for future fetch endpoint implementation
  return Promise.resolve({ data: { fixtures: [] } });
}

/**
 * Update article fixtures
 * POST /ai-article/fixtures
 *
 * Updates the articleDataForPrompt array for a specific article.
 * Performs a full replacement of all fixtures - partial updates are not supported.
 */
export async function updateArticleFixtures(payload: {
  accountId: number;
  renderId: number;
  articleId: number;
  fixtures: { prompt: string }[];
}): Promise<UpdateFixturesResponse> {
  const response = await fetcher.post<UpdateFixturesResponse>(
    "/ai-article/fixtures",
    payload
  );
  return response;
}
