import type { AppState, EntryType } from "../types";

export const entryTypes: Array<{
  id: EntryType;
  title: string;
  caption: string;
  icon: string;
}> = [
  { id: "task", title: "Задача", caption: "Что нужно сделать", icon: "check" },
  { id: "idea", title: "Идея", caption: "Мысль или инсайт", icon: "spark" },
  { id: "meeting", title: "Встреча", caption: "Событие в календаре", icon: "calendar" },
  { id: "note", title: "Заметка", caption: "Свободная запись", icon: "note" },
  { id: "meal", title: "Прием пищи", caption: "Калории и БЖУ", icon: "meal" },
  { id: "habit", title: "Привычка", caption: "Повторяемое действие", icon: "habit" },
  { id: "goal", title: "Цель", caption: "Длинный фокус", icon: "target" }
];

export const initialState: AppState = {
  calorieGoal: 2200,
  tasks: [
    { id: "t1", title: "Подготовить план недели", due: "10:30", priority: "high", done: false },
    { id: "t2", title: "Отправить отчет по проекту", due: "13:00", priority: "medium", done: false },
    { id: "t3", title: "Разобрать входящие заметки", due: "18:00", priority: "low", done: true }
  ],
  ideas: [
    { id: "i1", title: "Голосовое добавление записи из Telegram", tag: "product" },
    { id: "i2", title: "Еженедельный дайджест энергии", tag: "analytics" }
  ],
  meetings: [
    {
      id: "m1",
      time: "11:00",
      title: "Созвон с командой",
      description: "Синхронизация по задачам спринта",
      place: "Telegram",
      reminder: "за 10 минут"
    },
    {
      id: "m2",
      time: "16:30",
      title: "Тренировка",
      description: "Зал, верх тела",
      place: "Fit Space",
      reminder: "за 30 минут"
    }
  ],
  meals: [
    { id: "f1", title: "Овсянка с ягодами", calories: 430, protein: 18, fat: 12, carbs: 64 },
    { id: "f2", title: "Курица, рис и салат", calories: 720, protein: 48, fat: 21, carbs: 82 },
    { id: "f3", title: "Йогурт и орехи", calories: 260, protein: 16, fat: 14, carbs: 20 }
  ],
  habits: [
    { id: "h1", title: "Вода 2 л", streak: 12, progress: 86, doneToday: true },
    { id: "h2", title: "Чтение", streak: 6, progress: 64, doneToday: false },
    { id: "h3", title: "Без сахара", streak: 21, progress: 92, doneToday: true }
  ],
  notes: [
    { id: "n1", title: "Наблюдение дня", body: "Лучше планировать сложные задачи до обеда." }
  ],
  goals: [
    { id: "g1", title: "Запустить личную систему продуктивности", progress: 58 },
    { id: "g2", title: "Закрепить режим сна", progress: 72 }
  ]
};
