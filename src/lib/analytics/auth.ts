import type { MeResponse } from "./types";

const DEFAULT_ME_PATH = "/users/me";

export async function fetchCurrentUserId(): Promise<string | null> {
  const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
  if (!apiBaseUrl) {
    return null;
  }

  const mePath = process.env.VUE_APP_AUTH_ME_PATH || DEFAULT_ME_PATH;

  try {
    const response = await fetch(`${apiBaseUrl}${mePath}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as MeResponse;
    const userId = data.id ?? data.data?.id;

    if (userId === null || userId === undefined) {
      return null;
    }

    return String(userId);
  } catch {
    return null;
  }
}
