import { ArticleStatusData } from "@/store/aiArticles/service";

/**
 * Formatted article structure for display
 */
export interface FormattedArticle {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  articleBody: string;
  highlights: string;
  team1: string;
  team2: string;
  score1: string;
  score2: string;
  winner: string;
  assetType: string;
  assetCategory: string;
  hasError: boolean;
  errorHandler: any | null;
  hasCompleted: boolean;
  forceRerender: boolean;
  compositionID: string;
  articleDataForPrompt?: { prompt: string }[] | null; // Article-level context data (array of prompt objects)
}

/**
 * Flattened article structure as returned from the API/backend
 * This is the structure that articles have when passed to components
 */
export interface FlattenedArticle {
  id: number;
  name: string;
  hasCompleted: boolean;
  forceRerender: boolean;
  hasError: boolean;
  errorHandler: any | null;
  groupingCategory: string;
  assetLinkID: string;
  assetType: string | null;
  assetCategory: string | null;
  structuredOutput: any; // Parsed JSON from structuredOutput field
  compositionID: string;
  articleEditor: string;
  ArticleDataForPrompt: { prompt: string }[] | null;
  createdAt?: string; // Article creation date for legacy detection
}

/**
 * Article IDs required for API calls
 */
export interface ArticleIds {
  accountId: number | null;
  renderId: number | null;
  articleId: number | null;
}

/**
 * Article lifecycle phases
 */
export type ArticlePhase =
  | "initial"
  | "pending"
  | "postPending"
  | "articleWritten";

/**
 * Article status types
 */
export type ArticleStatus =
  | "idle"
  | "waiting"
  | "pending"
  | "writing"
  | "completed"
  | "failed";

/**
 * Helper function to update feedback from API response
 */
export function updateFeedbackFromResponse(
  data: ArticleStatusData,
  feedbackCount: { value: number },
  feedbackLimit: { value: number }
): void {
  if (typeof data.feedback?.count === "number") {
    feedbackCount.value = data.feedback.count;
  }
  if (typeof data.feedback?.limit === "number") {
    feedbackLimit.value = data.feedback.limit;
  }
}
