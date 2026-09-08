import type { ArticlePhase, ArticleStatus } from "@/types/ArticleTypes";

/** User-facing Press Box / writeup copy — single source of truth for UI strings. */
export const PRESSBOX_COPY = {
  panel: {
    title: "THE PRESS BOX",
    tabLabel: "Press Box",
    icon: "mdi-newspaper-variant-outline",
    loading: "Loading writeups…",
    disabled: "Press Box writeups are currently disabled.",
  },
  stats: {
    totalWriteups: "Press Box writeups",
    writeupsGenerated: "Writeups generated",
    writeupAssets: "Writeup assets",
    percentageWriteups: "Percentage writeups",
  },
  locked: {
    label: "Writeup locked",
  },
  status: {
    generatingTitle: "Writing your writeup…",
    generatingBodyWeekend:
      "Please wait whilst we write your match report. This may take some time depending on the number of fixtures this week.",
    generatingBodyDefault:
      "Please wait whilst we create your writeup. This may take some time.",
    generatingBodyLadder:
      "Please wait whilst we write your ladder summary. This may take some time.",
    generatingBodyUpcoming:
      "Please wait whilst we write your upcoming fixtures writeup. This may take some time.",
    generatingLeaveHint: "You can leave and check back later if you wish.",
    generatingSubtitleWriting: "Our AI is writing your writeup now.",
    generatingSubtitleQueued: "Your writeup is queued and will start shortly.",
    timeoutTitle: "Still working on your writeup",
    timeoutBody:
      "Generation is taking longer than usual. Your writeup may still be processing in the background.",
    timeoutLeaveHint:
      "You can leave this page and come back in a few minutes, or check for an update below.",
    checkForUpdate: "Check for update",
    keepWaiting: "Keep waiting",
    failedTitle: "Writeup generation failed",
    failedBody:
      "We encountered an issue while creating your writeup. This may happen if the writeup has been locked due to reaching the generation limit or if it's too old.",
    failedRetryHint:
      "Please try requesting a review again or contact support if the issue persists.",
    failedLockedBody:
      "This writeup can't be regenerated because it has reached the generation limit or is outside the eligibility window.",
    failedLockedHint: "Contact support if you believe this is an error.",
    tryAgain: "Try Again",
    retryGeneration: "Retry generation",
  },
  cta: {
    generateWriteup: "Generate writeup",
    requestReview: "Request a Review",
    sendToPressBox: "Send to Press Box",
    writing: "Writing…",
    pending: "Pending…",
    processing: "Processing…",
  },
  empty: {
    headline: "Send it to the Press Box",
    weekendDescription:
      "Our AI validates your fixture data and writes a professional match report you can copy and share.",
    weekendSubhead:
      "Edit, update, and create professional cricket writeups instantly.",
    ladderHeadline: "Ladder summaries from the Press Box",
    ladderSubhead: "Our AI analyzes league standings.",
    ladderDescription:
      "Write comprehensive ladder summaries you can customize and refine.",
    upcomingHeadline: "Upcoming fixtures from the Press Box",
    upcomingSubhead: "Our AI reviews your fixture schedule.",
    upcomingDescription:
      "Write professional preview writeups you can customize and refine.",
    top5DefaultHeadline: "Top 5 writeups from the Press Box",
    top5DefaultSubhead: "Our AI analyzes player data.",
    top5DefaultDescription:
      "Write comprehensive Top 5 listicles you can customize and refine.",
    teamOfWeekHeadline: "Team of the Week from the Press Box",
    teamOfWeekSubhead: "Our AI analyzes player performances.",
    teamOfWeekDescription:
      "Write comprehensive team selections you can customize and refine.",
    performanceHeadline: "Performance writeups from the Press Box",
    performanceSubhead: "Our AI analyzes batting and bowling stats.",
    performanceDescription:
      "Produce customizable performance summaries you can refine.",
  },
  legacy: {
    title: "Legacy writeup detected",
    body: "This writeup is no longer compatible with the new AI system.",
    renderIncompatible:
      "This render is no longer compatible with the new AI system.",
    newRenderHint:
      "Please create a new render to use the latest Press Box features.",
  },
  context: {
    addedTooltip: "Context has been added to this writeup",
    savedSuccess:
      "Context saved successfully! It will be used in future writeup generations.",
  },
  confirmation: {
    cancelLabel: "Cancel",
    genericSubhead: "Proceed with this request?",
    genericDescription:
      "This will start the Press Box workflow using your current data.",
    weekendInitialSubhead: "Send a new match report to the Press Box?",
    weekendInitialDescription:
      "We'll generate a fresh writeup based on your current fixture data.",
    weekendRegenerationSubhead: "Request a review of this match report?",
    weekendRegenerationDescription:
      "We'll generate a new version using your saved editorial context or fixture changes.",
    ladderInitialSubhead: "Send a new ladder summary to the Press Box?",
    ladderInitialDescription:
      "We'll generate a fresh writeup based on your current standings data.",
    upcomingInitialSubhead:
      "Send a new upcoming fixtures writeup to the Press Box?",
    upcomingInitialDescription:
      "We'll generate a fresh writeup based on your current schedule.",
    top5InitialSubhead: "Send a new Top 5 writeup to the Press Box?",
    top5InitialDescription:
      "We'll generate a fresh writeup based on your current player data.",
    teamOfWeekInitialSubhead:
      "Send a new Team of the Week writeup to the Press Box?",
    teamOfWeekInitialDescription:
      "We'll generate a fresh writeup based on your current selections.",
    performanceInitialSubhead:
      "Send a new performance writeup to the Press Box?",
    performanceInitialDescription:
      "We'll generate a fresh writeup based on your current stats.",
    regenerationSubhead: "Request a review of this writeup?",
    regenerationDescription:
      "We'll generate a new version using your saved editorial context.",
  },
  errors: {
    locked: "This writeup can't be regenerated (limit or age).",
    generationFailed: "Writeup generation failed",
    generationFailedPeriod: "Writeup generation failed.",
    triggerFailed: "Unable to start writeup generation.",
    lockedLimit:
      "This writeup can't be regenerated (limit reached or outside the eligibility window).",
    generationInProgress: "Generation in progress…",
    networkError:
      "We couldn't reach the server. Check your connection and try again.",
    resetFailed: "Unable to reset this writeup for another attempt.",
    resetInFlight:
      "This writeup is still generating. Wait for it to finish before retrying.",
    resetNotAvailable:
      "Writeup reset is not available. Restart or update CMS, then try again.",
  },
  tooltips: {
    rewriteNeedsContextOrFixtures:
      "Add editorial context or save fixture changes to request a review.",
    rewriteNeedsContext: "Add editorial context to request a review.",
    backToWriteup: "Back to writeup",
  },
  navigation: {
    categoriesSubtitle: "Click a category to view the assets and writeups",
  },
} as const;

export function formatCategoryWriteupCount(count: number): string {
  return `${count} writeups`;
}

export function getConfirmModalTitle(buttonLabel: string): string {
  return `Confirm ${buttonLabel}`;
}

export type PressboxArticleKind = "weekend" | "ladder" | "upcoming" | "top5";

export function resolvePressboxConfirmationCopy(
  kind: PressboxArticleKind,
  phase: ArticlePhase,
  assetType = ""
): { subhead: string; description: string } {
  if (phase === "articleWritten") {
    if (kind === "weekend") {
      return {
        subhead: PRESSBOX_COPY.confirmation.weekendRegenerationSubhead,
        description: PRESSBOX_COPY.confirmation.weekendRegenerationDescription,
      };
    }

    return {
      subhead: PRESSBOX_COPY.confirmation.regenerationSubhead,
      description: PRESSBOX_COPY.confirmation.regenerationDescription,
    };
  }

  if (phase !== "initial" && phase !== "postPending") {
    return {
      subhead: PRESSBOX_COPY.confirmation.genericSubhead,
      description: PRESSBOX_COPY.confirmation.genericDescription,
    };
  }

  if (kind === "weekend") {
    return {
      subhead: PRESSBOX_COPY.confirmation.weekendInitialSubhead,
      description: PRESSBOX_COPY.confirmation.weekendInitialDescription,
    };
  }

  if (kind === "ladder") {
    return {
      subhead: PRESSBOX_COPY.confirmation.ladderInitialSubhead,
      description: PRESSBOX_COPY.confirmation.ladderInitialDescription,
    };
  }

  if (kind === "upcoming") {
    return {
      subhead: PRESSBOX_COPY.confirmation.upcomingInitialSubhead,
      description: PRESSBOX_COPY.confirmation.upcomingInitialDescription,
    };
  }

  if (assetType === "CricketTeamOfTheWeek") {
    return {
      subhead: PRESSBOX_COPY.confirmation.teamOfWeekInitialSubhead,
      description: PRESSBOX_COPY.confirmation.teamOfWeekInitialDescription,
    };
  }

  if (
    assetType === "CricketBattingPerformances" ||
    assetType === "CricketBowlingPerformances"
  ) {
    return {
      subhead: PRESSBOX_COPY.confirmation.performanceInitialSubhead,
      description: PRESSBOX_COPY.confirmation.performanceInitialDescription,
    };
  }

  return {
    subhead: PRESSBOX_COPY.confirmation.top5InitialSubhead,
    description: PRESSBOX_COPY.confirmation.top5InitialDescription,
  };
}

export function getPressboxButtonText(
  phase: ArticlePhase,
  status: ArticleStatus
): string {
  if (phase === "pending") {
    if (status === "writing") return PRESSBOX_COPY.cta.writing;
    if (status === "pending") return PRESSBOX_COPY.cta.pending;
    return PRESSBOX_COPY.cta.processing;
  }

  if (phase === "articleWritten") {
    return PRESSBOX_COPY.cta.requestReview;
  }

  return PRESSBOX_COPY.cta.sendToPressBox;
}

export function getTop5EmptyStateCopy(assetType: string): {
  headline: string;
  subhead?: string;
  description: string;
} {
  if (assetType === "CricketTeamOfTheWeek") {
    return {
      headline: PRESSBOX_COPY.empty.teamOfWeekHeadline,
      subhead: PRESSBOX_COPY.empty.teamOfWeekSubhead,
      description: PRESSBOX_COPY.empty.teamOfWeekDescription,
    };
  }

  if (
    assetType === "CricketBattingPerformances" ||
    assetType === "CricketBowlingPerformances"
  ) {
    return {
      headline: PRESSBOX_COPY.empty.performanceHeadline,
      subhead: PRESSBOX_COPY.empty.performanceSubhead,
      description: PRESSBOX_COPY.empty.performanceDescription,
    };
  }

  return {
    headline: PRESSBOX_COPY.empty.top5DefaultHeadline,
    subhead: PRESSBOX_COPY.empty.top5DefaultSubhead,
    description: PRESSBOX_COPY.empty.top5DefaultDescription,
  };
}
