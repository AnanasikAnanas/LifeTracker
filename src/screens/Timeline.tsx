import { Icon } from "../components/Icon";
import { SectionHeader } from "../components/SectionHeader";
import type { AppState, EntryType } from "../types";

type TimelineItem = {
  id: string;
  type: EntryType;
  title: string;
  meta: string;
  time: string;
  tone: "blue" | "mint" | "amber" | "rose" | "violet";
};

const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0
});

function buildTimeline(state: AppState): TimelineItem[] {
  const tasks: TimelineItem[] = state.tasks.map((task) => ({
    id: task.id,
    type: "task",
    title: task.title,
    meta: task.done ? "задача выполнена" : `${task.priority} приоритет`,
    time: task.due || "сегодня",
    tone: task.done ? "mint" : "blue"
  }));

  const meetings: TimelineItem[] = state.meetings.map((meeting) => ({
    id: meeting.id,
    type: "meeting",
    title: meeting.title,
    meta: `${meeting.place} · ${meeting.reminder}`,
    time: meeting.time,
    tone: "violet"
  }));

  const meals: TimelineItem[] = state.meals.map((meal) => ({
    id: meal.id,
    type: "meal",
    title: meal.title,
    meta: `${meal.calories} ккал · Б ${meal.protein} · Ж ${meal.fat} · У ${meal.carbs}`,
    time: "питание",
    tone: "amber"
  }));

  const finances: TimelineItem[] = state.finances.map((item) => ({
    id: item.id,
    type: "finance",
    title: item.title,
    meta: `${item.kind === "income" ? "доход" : "расход"} · ${item.category} · ${moneyFormatter.format(item.amount)}`,
    time: item.account,
    tone: item.kind === "income" ? "mint" : "rose"
  }));

  const habits: TimelineItem[] = state.habits.map((habit) => ({
    id: habit.id,
    type: "habit",
    title: habit.title,
    meta: `${habit.streak} дней серия · ${habit.doneToday ? "сделано" : "ждет"}`,
    time: "привычка",
    tone: habit.doneToday ? "mint" : "blue"
  }));

  const notes: TimelineItem[] = state.notes.map((note) => ({
    id: note.id,
    type: "note",
    title: note.title,
    meta: note.body,
    time: "заметка",
    tone: "violet"
  }));

  const goals: TimelineItem[] = state.goals.map((goal) => ({
    id: goal.id,
    type: "goal",
    title: goal.title,
    meta: `${goal.progress}% прогресс`,
    time: "цель",
    tone: "blue"
  }));

  return [...meetings, ...tasks, ...finances, ...meals, ...habits, ...notes, ...goals];
}

export function Timeline({ state, onAdd }: { state: AppState; onAdd: (type: EntryType) => void }) {
  const items = buildTimeline(state);

  return (
    <section className="screen">
      <SectionHeader title="Лента дня" subtitle={`${items.length} записей сегодня`} actionLabel="Добавить запись" onAction={() => onAdd("note")} />

      <div className="quick-row">
        <button className="quick-action" type="button" onClick={() => onAdd("task")}>
          <Icon name="task" size={18} />
          <span>Задача</span>
        </button>
        <button className="quick-action" type="button" onClick={() => onAdd("finance")}>
          <Icon name="finance" size={18} />
          <span>Расход</span>
        </button>
        <button className="quick-action" type="button" onClick={() => onAdd("meal")}>
          <Icon name="meal" size={18} />
          <span>Еда</span>
        </button>
        <button className="quick-action" type="button" onClick={() => onAdd("meeting")}>
          <Icon name="meeting" size={18} />
          <span>Встреча</span>
        </button>
      </div>

      <div className="timeline-feed">
        {items.length ? (
          items.map((item) => (
            <article className="feed-row" key={`${item.type}-${item.id}`}>
              <div className={`feed-icon ${item.tone}`}>
                <Icon name={item.type} size={18} />
              </div>
              <div>
                <time>{item.time}</time>
                <strong>{item.title}</strong>
                <span>{item.meta}</span>
              </div>
            </article>
          ))
        ) : (
          <article className="empty-state">
            <strong>День пока пуст</strong>
            <span>Добавьте первую запись вручную или голосом.</span>
          </article>
        )}
      </div>
    </section>
  );
}
