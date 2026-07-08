export type View =
  | "home"
  | "add"
  | "tasks"
  | "calendar"
  | "nutrition"
  | "habits"
  | "records"
  | "stats";

export type EntryType =
  | "task"
  | "idea"
  | "meeting"
  | "note"
  | "meal"
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
  habits: Habit[];
  notes: Note[];
  goals: Goal[];
  calorieGoal: number;
}
