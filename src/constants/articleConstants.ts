/**
 * Polling configuration constants
 */
export const POLLING_CONFIG = {
  INTERVAL_MS: 5000, // 5 seconds
  MAX_DURATION_MS: 5 * 60 * 1000, // 5 minutes
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
