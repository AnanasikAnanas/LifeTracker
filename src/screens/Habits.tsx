import { ProgressBar } from "../components/ProgressBar";
import { SectionHeader } from "../components/SectionHeader";
import { Icon } from "../components/Icon";
import type { Habit } from "../types";

export function Habits({
  habits,
  onToggle,
  onAdd,
  onDelete
}: {
  habits: Habit[];
  onToggle: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="screen">
      <SectionHeader title="Привычки" subtitle="ритм и серии" actionLabel="Добавить привычку" onAction={onAdd} />

      <div className="list-stack">
        {habits.length ? (
          habits.map((habit) => (
            <article className={`habit-row ${habit.doneToday ? "done" : ""}`} key={habit.id}>
              <button className="habit-main" type="button" onClick={() => onToggle(habit.id)}>
              <div>
                <strong>{habit.title}</strong>
                <span>{habit.streak} дней серия</span>
              </div>
              <div className="habit-progress">
                <ProgressBar value={habit.progress} />
                <small>{habit.doneToday ? "сделано" : "ждет"}</small>
              </div>
              </button>
              <button className="mini-icon-button danger" type="button" aria-label="Удалить привычку" onClick={() => onDelete(habit.id)}>
                <Icon name="trash" size={17} />
              </button>
            </article>
          ))
        ) : (
          <article className="empty-state">
            <strong>Нет привычек</strong>
            <span>Добавьте один маленький ритуал на сегодня.</span>
          </article>
        )}
      </div>
    </section>
  );
}
