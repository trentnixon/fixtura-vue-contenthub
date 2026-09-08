import type { ArticlePhase } from "@/types/ArticleTypes";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";

export type TriggerRequestReason =
  | "initial"
  | "editorial_feedback"
  | "source_changed";

export interface RegenerationGateInput {
  articlePhase: ArticlePhase;
  articleStatus?: string;
  isLocked: boolean;
  isPending: boolean;
  hasContext: boolean;
  fixturesSavedForRegeneration: boolean;
  supportsFixtureRegeneration: boolean;
}

export function isFailedGenerationRetry(
  articleStatus: string | undefined
): boolean {
  return articleStatus === "failed";
}

/**
 * Pressbox regeneration requires editorial context and/or saved fixture changes.
 * First write (non-articleWritten phases) is allowed when not locked/pending.
 * Failed generation always allows retry when not locked/pending.
 */
export function canRequestRegeneration(input: RegenerationGateInput): boolean {
  if (input.isLocked || input.isPending) {
    return false;
  }

  if (isFailedGenerationRetry(input.articleStatus)) {
    return true;
  }

  if (input.articlePhase !== "articleWritten") {
    return true;
  }

  if (input.supportsFixtureRegeneration) {
    return input.hasContext || input.fixturesSavedForRegeneration;
  }

  return input.hasContext;
}

/**
 * Q4 decision tree: fixture save → source_changed; context only → editorial_feedback.
 */
export function resolveTriggerRequestReason(input: {
  isRegeneration: boolean;
  isFailedRetry?: boolean;
  hasContext: boolean;
  fixturesSavedForRegeneration: boolean;
}): TriggerRequestReason | null {
  if (input.isFailedRetry) {
    if (input.fixturesSavedForRegeneration) {
      return "source_changed";
    }
    if (input.hasContext) {
      return "editorial_feedback";
    }
    return "initial";
  }

  if (!input.isRegeneration) {
    return "initial";
  }

  if (input.fixturesSavedForRegeneration) {
    return "source_changed";
  }

  if (input.hasContext) {
    return "editorial_feedback";
  }

  return null;
}

export function getRewriteDisabledTooltip(
  input: RegenerationGateInput
): string | null {
  if (input.isPending) {
    return PRESSBOX_COPY.errors.generationInProgress;
  }

  if (input.isLocked) {
    return PRESSBOX_COPY.errors.locked;
  }

  if (
    isFailedGenerationRetry(input.articleStatus) ||
    input.articlePhase !== "articleWritten"
  ) {
    return null;
  }

  if (input.supportsFixtureRegeneration) {
    if (!input.hasContext && !input.fixturesSavedForRegeneration) {
      return PRESSBOX_COPY.tooltips.rewriteNeedsContextOrFixtures;
    }
    return null;
  }

  if (!input.hasContext) {
    return PRESSBOX_COPY.tooltips.rewriteNeedsContext;
  }

  return null;
}
