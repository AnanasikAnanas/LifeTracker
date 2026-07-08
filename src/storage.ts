import { getTelegramCloudStorage } from "./telegram";
import type { AppState } from "./types";

const storageKey = "life-tracker-state-v1";

function normalizeState(fallback: AppState, value: unknown): AppState {
  const parsed = typeof value === "object" && value !== null ? (value as Partial<AppState>) : {};

  return {
    ...fallback,
    ...parsed,
    tasks: Array.isArray(parsed.tasks) ? parsed.tasks : fallback.tasks,
    ideas: Array.isArray(parsed.ideas) ? parsed.ideas : fallback.ideas,
    meetings: Array.isArray(parsed.meetings) ? parsed.meetings : fallback.meetings,
    meals: Array.isArray(parsed.meals) ? parsed.meals : fallback.meals,
    finances: Array.isArray(parsed.finances) ? parsed.finances : fallback.finances,
    financeBudgets:
      parsed.financeBudgets && typeof parsed.financeBudgets === "object"
        ? { ...fallback.financeBudgets, ...parsed.financeBudgets }
        : fallback.financeBudgets,
    habits: Array.isArray(parsed.habits) ? parsed.habits : fallback.habits,
    notes: Array.isArray(parsed.notes) ? parsed.notes : fallback.notes,
    goals: Array.isArray(parsed.goals) ? parsed.goals : fallback.goals,
    calorieGoal: typeof parsed.calorieGoal === "number" ? parsed.calorieGoal : fallback.calorieGoal
  };
}

export function loadLocalState(fallback: AppState): AppState {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? normalizeState(fallback, JSON.parse(saved)) : fallback;
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
        resolve(normalizeState(fallback, JSON.parse(value)));
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
