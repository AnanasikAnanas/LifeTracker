export type View =
  | "home"
  | "timeline"
  | "add"
  | "tasks"
  | "calendar"
  | "nutrition"
  | "habits"
  | "finances"
  | "records"
  | "stats";

export type EntryType =
  | "task"
  | "idea"
  | "meeting"
  | "note"
  | "meal"
  | "finance"
  | "habit"
  | "goal";

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  due: string;
  priority: Priority;
  done: boolean;
}

export interface Idea {
  id: string;
  title: string;
  tag: string;
}

export interface Meeting {
  id: string;
  time: string;
  title: string;
  description: string;
  place: string;
  reminder: string;
  done?: boolean;
}

export interface Meal {
  id: string;
  title: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export type FinanceKind = "expense" | "income";

export interface FinanceRecord {
  id: string;
  title: string;
  amount: number;
  kind: FinanceKind;
  category: string;
  account: string;
  note: string;
  date: string;
}

export type FinanceBudgets = Record<string, number>;

export interface Habit {
  id: string;
  title: string;
  streak: number;
  progress: number;
  doneToday: boolean;
}

export interface Note {
  id: string;
  title: string;
  body: string;
}

export interface Goal {
  id: string;
  title: string;
  progress: number;
}

export interface AppState {
  tasks: Task[];
  ideas: Idea[];
  meetings: Meeting[];
  meals: Meal[];
  finances: FinanceRecord[];
  financeBudgets: FinanceBudgets;
  habits: Habit[];
  notes: Note[];
  goals: Goal[];
  calorieGoal: number;
}
