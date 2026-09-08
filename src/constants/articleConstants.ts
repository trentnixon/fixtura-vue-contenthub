/**
 * Polling configuration constants
 */
export const POLLING_CONFIG = {
  INTERVAL_MS: 5000, // 5 seconds
  MAX_DURATION_MS: 5 * 60 * 1000, // 5 minutes
  /** Stop polling only after this many consecutive poll request failures. */
  MAX_CONSECUTIVE_NETWORK_ERRORS: 3,
} as const;

/**
 * Feedback configuration constants
 */
export const FEEDBACK_CONFIG = {
  DEFAULT_LIMIT: 5,
} as const;

/**
 * Article status constants
 */
export const ARTICLE_STATUS = {
  IDLE: "idle",
  WAITING: "waiting",
  PENDING: "pending",
  WRITING: "writing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

/** CMS Pressbox in-flight statuses (pending → writing → completed). */
export const IN_FLIGHT_ARTICLE_STATUSES = [
  ARTICLE_STATUS.PENDING,
  ARTICLE_STATUS.WRITING,
] as const;

export type InFlightArticleStatus = (typeof IN_FLIGHT_ARTICLE_STATUSES)[number];

export function isArticleGenerationInFlight(
  status: string | null | undefined
): boolean {
  return status === ARTICLE_STATUS.PENDING || status === ARTICLE_STATUS.WRITING;
}
