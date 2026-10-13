import type { ArticlePhase } from "@/types/ArticleTypes";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";

export type TriggerRequestReason =
  | "initial"
  | "editorial_feedback"
  | "source_changed"
  | "user_requested_regeneration";

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
 * Pressbox regeneration is allowed whenever the writeup is not locked or in progress.
 * Attempt limits and eligibility are enforced by CMS (403 / locked status).
 */
export function canRequestRegeneration(input: RegenerationGateInput): boolean {
  return !input.isLocked && !input.isPending;
}

/**
 * Resolve controlled requestReason for CMS Pressbox trigger.
 * Regeneration priority: source_changed → editorial_feedback → user_requested_regeneration.
 *
 * Contract (TKT-PBX-013 / Round 1 2026-09-09):
 * - user_requested_regeneration is evidence-free at CMS (lock/limit/window only).
 * - Persisted context ⇒ editorial_feedback even if user did not edit context this session (Q4).
 * - Plain regen may still include persisted userFeedbackPrompt in worker snapshot (Q3-A); Hub does not clear context.
 */
export function resolveTriggerRequestReason(input: {
  isRegeneration: boolean;
  isFailedRetry?: boolean;
  hasPriorWriteup: boolean;
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
    return input.hasPriorWriteup ? "user_requested_regeneration" : "initial";
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

  return "user_requested_regeneration";
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

  return null;
}
