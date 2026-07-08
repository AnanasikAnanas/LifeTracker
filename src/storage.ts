import { getTelegramCloudStorage } from "./telegram";
import type { AppState } from "./types";

const storageKey = "life-tracker-state-v1";

export function loadLocalState(fallback: AppState): AppState {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  } catch {
    return fallback;
  }
}

export async function loadStoredState(fallback: AppState): Promise<AppState> {
  const cloudStorage = getTelegramCloudStorage();

  if (!cloudStorage) {
    return loadLocalState(fallback);
  }

  return new Promise((resolve) => {
    cloudStorage.getItem(storageKey, (error, value) => {
      if (error || !value) {
        resolve(loadLocalState(fallback));
        return;
      }

      try {
        resolve({ ...fallback, ...JSON.parse(value) });
      } catch {
        resolve(loadLocalState(fallback));
      }
    });
  });
}

export async function saveStoredState(state: AppState) {
  const serialized = JSON.stringify(state);
  localStorage.setItem(storageKey, serialized);

  const cloudStorage = getTelegramCloudStorage();

  if (!cloudStorage) {
    return;
  }

  await new Promise<void>((resolve) => {
    cloudStorage.setItem(storageKey, serialized, () => resolve());
  });
}
