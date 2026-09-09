import {
  canRequestRegeneration,
  getRewriteDisabledTooltip,
  isFailedGenerationRetry,
  resolveTriggerRequestReason,
  type RegenerationGateInput,
} from "@/composables/aiArticles/pressboxTrigger";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";

function gateInput(
  overrides: Partial<RegenerationGateInput> = {}
): RegenerationGateInput {
  return {
    articlePhase: "articleWritten",
    articleStatus: "completed",
    isLocked: false,
    isPending: false,
    hasContext: false,
    fixturesSavedForRegeneration: false,
    supportsFixtureRegeneration: false,
    ...overrides,
  };
}

describe("pressboxTrigger", () => {
  describe("isFailedGenerationRetry", () => {
    it("returns true only for failed status", () => {
      expect(isFailedGenerationRetry("failed")).toBe(true);
      expect(isFailedGenerationRetry("completed")).toBe(false);
      expect(isFailedGenerationRetry(undefined)).toBe(false);
    });
  });

  describe("canRequestRegeneration", () => {
    it("allows regeneration when not locked or pending", () => {
      expect(canRequestRegeneration(gateInput())).toBe(true);
    });

    it("allows plain regen after writeup without context or fixture saves", () => {
      expect(
        canRequestRegeneration(
          gateInput({
            articlePhase: "articleWritten",
            hasContext: false,
            fixturesSavedForRegeneration: false,
          })
        )
      ).toBe(true);
    });

    it("blocks when locked", () => {
      expect(canRequestRegeneration(gateInput({ isLocked: true }))).toBe(false);
    });

    it("blocks when pending", () => {
      expect(canRequestRegeneration(gateInput({ isPending: true }))).toBe(false);
    });
  });

  describe("resolveTriggerRequestReason", () => {
    it("returns initial for first write", () => {
      expect(
        resolveTriggerRequestReason({
          isRegeneration: false,
          hasPriorWriteup: false,
          hasContext: false,
          fixturesSavedForRegeneration: false,
        })
      ).toBe("initial");
    });

    it("returns user_requested_regeneration for plain regen", () => {
      expect(
        resolveTriggerRequestReason({
          isRegeneration: true,
          hasPriorWriteup: true,
          hasContext: false,
          fixturesSavedForRegeneration: false,
        })
      ).toBe("user_requested_regeneration");
    });

    it("returns editorial_feedback when persisted context exists", () => {
      expect(
        resolveTriggerRequestReason({
          isRegeneration: true,
          hasPriorWriteup: true,
          hasContext: true,
          fixturesSavedForRegeneration: false,
        })
      ).toBe("editorial_feedback");
    });

    it("prefers source_changed when fixtures were saved", () => {
      expect(
        resolveTriggerRequestReason({
          isRegeneration: true,
          hasPriorWriteup: true,
          hasContext: true,
          fixturesSavedForRegeneration: true,
        })
      ).toBe("source_changed");
    });

    it("returns initial for failed first-write retry", () => {
      expect(
        resolveTriggerRequestReason({
          isRegeneration: false,
          isFailedRetry: true,
          hasPriorWriteup: false,
          hasContext: false,
          fixturesSavedForRegeneration: false,
        })
      ).toBe("initial");
    });

    it("returns user_requested_regeneration for failed regen retry", () => {
      expect(
        resolveTriggerRequestReason({
          isRegeneration: false,
          isFailedRetry: true,
          hasPriorWriteup: true,
          hasContext: false,
          fixturesSavedForRegeneration: false,
        })
      ).toBe("user_requested_regeneration");
    });
  });

  describe("getRewriteDisabledTooltip", () => {
    it("returns pending message when generation is in flight", () => {
      expect(
        getRewriteDisabledTooltip(gateInput({ isPending: true }))
      ).toBe(PRESSBOX_COPY.errors.generationInProgress);
    });

    it("returns locked message when writeup is locked", () => {
      expect(getRewriteDisabledTooltip(gateInput({ isLocked: true }))).toBe(
        PRESSBOX_COPY.errors.locked
      );
    });

    it("returns null when plain regen is allowed", () => {
      expect(
        getRewriteDisabledTooltip(
          gateInput({
            articlePhase: "articleWritten",
            hasContext: false,
          })
        )
      ).toBeNull();
    });
  });
});
