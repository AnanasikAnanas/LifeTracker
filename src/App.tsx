import { useEffect, useMemo, useState } from "react";
import { Dashboard } from "./screens/Dashboard";
import { AddEntry } from "./screens/AddEntry";
import { Tasks } from "./screens/Tasks";
import { Calendar } from "./screens/Calendar";
import { Nutrition } from "./screens/Nutrition";
import { Habits } from "./screens/Habits";
import { Finances } from "./screens/Finances";
import { Records } from "./screens/Records";
import { Stats } from "./screens/Stats";
import { BottomNav } from "./components/BottomNav";
import { initialState } from "./data/mock";
import { loadLocalState, loadStoredState, saveStoredState } from "./storage";
import { bindTelegramBackButton, getTelegramUser, isTelegramMiniApp, showConfirm, tapFeedback } from "./telegram";
import type { TelegramUser } from "./telegram";
import type { AppState, EntryType, FinanceKind, Habit, Priority, Task, View } from "./types";

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function normalizeFinanceKind(value: string): FinanceKind {
  return value === "income" || /доход|приход|получ/i.test(value) ? "income" : "expense";
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [state, setState] = useState<AppState>(() => loadLocalState(initialState));
  const [preferredType, setPreferredType] = useState<EntryType>("task");
  const [storageReady, setStorageReady] = useState(!isTelegramMiniApp());
  const [telegramUser, setTelegramUser] = useState<TelegramUser | undefined>(() => getTelegramUser());

  useEffect(() => {
    let isMounted = true;

    loadStoredState(initialState).then((storedState) => {
      if (!isMounted) {
        return;
      }

      setState(storedState);
      setTelegramUser(getTelegramUser());
      setStorageReady(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    void saveStoredState(state);
  }, [state, storageReady]);

  useEffect(() => {
    return bindTelegramBackButton(view !== "home", () => {
      tapFeedback();
      setView("home");
    });
  }, [view]);

  const completedTasks = state.tasks.filter((task) => task.done).length;
  const eatenCalories = state.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const completedHabits = state.habits.filter((habit) => habit.doneToday).length;
  const financeIncome = state.finances.filter((item) => item.kind === "income").reduce((sum, item) => sum + item.amount, 0);
  const financeExpense = state.finances.filter((item) => item.kind === "expense").reduce((sum, item) => sum + item.amount, 0);

  const dayProgress = useMemo(() => {
    const taskScore = state.tasks.length ? completedTasks / state.tasks.length : 0;
    const habitScore = state.habits.length ? completedHabits / state.habits.length : 0;
    const calorieScore = Math.min(eatenCalories / state.calorieGoal, 1);
    return Math.round(((taskScore + habitScore + calorieScore) / 3) * 100);
  }, [completedHabits, completedTasks, eatenCalories, state.calorieGoal, state.habits.length, state.tasks.length]);

  function navigate(nextView: View) {
    tapFeedback();
    setView(nextView);
  }

  function openAdd(type: EntryType = "task") {
    setPreferredType(type);
    navigate("add");
  }

  function addEntry(type: EntryType, payload: Record<string, string>) {
    setState((current) => {
      if (type === "task") {
        const task: Task = {
          id: createId("task"),
          title: payload.title || "Новая задача",
          due: payload.time || "Сегодня",
          priority: (payload.priority as Priority) || "medium",
          done: false
        };
        return { ...current, tasks: [task, ...current.tasks] };
      }

      if (type === "idea") {
        return {
          ...current,
          ideas: [{ id: createId("idea"), title: payload.title || "Новая идея", tag: payload.tag || "idea" }, ...current.ideas]
        };
      }

      if (type === "meeting") {
        return {
          ...current,
          meetings: [
            {
              id: createId("meeting"),
              time: payload.time || "12:00",
              title: payload.title || "Новая встреча",
              description: payload.description || "Без описания",
              place: payload.place || "Telegram",
              reminder: payload.reminder || "за 10 минут"
            },
            ...current.meetings
          ]
        };
      }

      if (type === "meal") {
        return {
          ...current,
          meals: [
            {
              id: createId("meal"),
              title: payload.title || "Прием пищи",
              calories: Number(payload.calories || 0),
              protein: Number(payload.protein || 0),
              fat: Number(payload.fat || 0),
              carbs: Number(payload.carbs || 0)
            },
            ...current.meals
          ]
        };
      }

      if (type === "finance") {
        return {
          ...current,
          finances: [
            {
              id: createId("finance"),
              title: payload.title || "Финансовая операция",
              amount: Number(payload.amount || 0),
              kind: normalizeFinanceKind(payload.kind || "expense"),
              category: payload.category || "Разное",
              account: payload.account || "Карта",
              note: payload.note || "",
              date: new Date().toISOString()
            },
            ...current.finances
          ]
        };
      }

      if (type === "habit") {
        const habit: Habit = {
          id: createId("habit"),
          title: payload.title || "Новая привычка",
          streak: Number(payload.streak || 0),
          progress: Number(payload.progress || 0),
          doneToday: false
        };
        return { ...current, habits: [habit, ...current.habits] };
      }

      if (type === "goal") {
        return {
          ...current,
          goals: [{ id: createId("goal"), title: payload.title || "Новая цель", progress: Number(payload.progress || 0) }, ...current.goals]
        };
      }

      return {
        ...current,
        notes: [
          {
            id: createId("note"),
            title: payload.title || "Новая заметка",
            body: payload.description || payload.body || "Без текста"
          },
          ...current.notes
        ]
      };
    });

    tapFeedback("medium");
    setView(type === "finance" ? "finances" : "home");
  }

  function toggleTask(id: string) {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
    }));
  }

  function toggleHabit(id: string) {
    setState((current) => ({
      ...current,
      habits: current.habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              doneToday: !habit.doneToday,
              streak: habit.doneToday ? Math.max(habit.streak - 1, 0) : habit.streak + 1
            }
          : habit
      )
    }));
  }

  function deleteEntry(type: EntryType, id: string) {
    tapFeedback("medium");
    setState((current) => {
      if (type === "task") return { ...current, tasks: current.tasks.filter((item) => item.id !== id) };
      if (type === "idea") return { ...current, ideas: current.ideas.filter((item) => item.id !== id) };
      if (type === "meeting") return { ...current, meetings: current.meetings.filter((item) => item.id !== id) };
      if (type === "meal") return { ...current, meals: current.meals.filter((item) => item.id !== id) };
      if (type === "finance") return { ...current, finances: current.finances.filter((item) => item.id !== id) };
      if (type === "habit") return { ...current, habits: current.habits.filter((item) => item.id !== id) };
      if (type === "goal") return { ...current, goals: current.goals.filter((item) => item.id !== id) };
      return { ...current, notes: current.notes.filter((item) => item.id !== id) };
    });
  }

  function updateCalorieGoal(calorieGoal: number) {
    setState((current) => ({ ...current, calorieGoal: Math.max(1, calorieGoal) }));
  }

  function exportData() {
    const exportedAt = new Date().toISOString();
    downloadJson(`life-tracker-${exportedAt.slice(0, 10)}.json`, { exportedAt, state });
    tapFeedback("medium");
  }

  async function resetData() {
    const confirmed = await showConfirm("Сбросить все данные и вернуть демо-набор?");

    if (!confirmed) {
      return;
    }

    setState(initialState);
    tapFeedback("heavy");
    setView("home");
  }

  const screen = {
    home: (
      <Dashboard
        state={state}
        completedTasks={completedTasks}
        completedHabits={completedHabits}
        dayProgress={dayProgress}
        eatenCalories={eatenCalories}
        financeIncome={financeIncome}
        financeExpense={financeExpense}
        user={telegramUser}
        isTelegram={isTelegramMiniApp()}
        onAdd={openAdd}
        onNavigate={navigate}
      />
    ),
    add: <AddEntry initialType={preferredType} onAdd={addEntry} onCancel={() => navigate("home")} />,
    tasks: <Tasks tasks={state.tasks} onAdd={() => openAdd("task")} onToggle={toggleTask} onDelete={(id) => deleteEntry("task", id)} />,
    calendar: <Calendar meetings={state.meetings} onAdd={() => openAdd("meeting")} onDelete={(id) => deleteEntry("meeting", id)} />,
    nutrition: (
      <Nutrition
        meals={state.meals}
        calorieGoal={state.calorieGoal}
        onAdd={() => openAdd("meal")}
        onDelete={(id) => deleteEntry("meal", id)}
        onUpdateGoal={updateCalorieGoal}
      />
    ),
    finances: <Finances finances={state.finances} onAdd={() => openAdd("finance")} onDelete={(id) => deleteEntry("finance", id)} />,
    habits: <Habits habits={state.habits} onAdd={() => openAdd("habit")} onToggle={toggleHabit} onDelete={(id) => deleteEntry("habit", id)} />,
    records: <Records state={state} onAdd={openAdd} onDelete={deleteEntry} />,
    stats: (
      <Stats
        state={state}
        completedTasks={completedTasks}
        completedHabits={completedHabits}
        eatenCalories={eatenCalories}
        financeIncome={financeIncome}
        financeExpense={financeExpense}
        dayProgress={dayProgress}
        onExport={exportData}
        onReset={resetData}
      />
    )
  }[view];

  return (
    <main className="app-shell">
      <div className="phone-frame">
        <div className="screen-scroll">{screen}</div>
        <BottomNav active={view} onNavigate={navigate} />
      </div>
    </main>
  );
}
