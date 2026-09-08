import axios from "axios";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";

/** True when axios failed before receiving an HTTP response (timeout, offline, etc.). */
export function isTransientNetworkError(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response;
}

/**
 * Extract a user-facing message from CMS trigger/status errors.
 */
export function parseTriggerError(error: unknown): string {
  if (isTransientNetworkError(error)) {
    return PRESSBOX_COPY.errors.networkError;
  }

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { error?: { message?: string; details?: string } }
      | { message?: string }
      | undefined;

    const fromErrorObject =
      data &&
      typeof data === "object" &&
      "error" in data &&
      data.error &&
      typeof data.error === "object"
        ? data.error.message || data.error.details
        : undefined;

    if (fromErrorObject && typeof fromErrorObject === "string") {
      return fromErrorObject;
    }

    if (error.response?.status === 403) {
      return PRESSBOX_COPY.errors.lockedLimit;
    }

    if (error.response?.status === 404) {
      return PRESSBOX_COPY.errors.resetNotAvailable;
    }

    if (error.response?.status === 409) {
      return PRESSBOX_COPY.errors.resetInFlight;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return PRESSBOX_COPY.errors.triggerFailed;
}
