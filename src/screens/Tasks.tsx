import { SectionHeader } from "../components/SectionHeader";
import { Icon } from "../components/Icon";
import type { Task } from "../types";

const priorityLabel = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий"
};

export function Tasks({
  tasks,
  onToggle,
  onAdd,
  onDelete
}: {
  tasks: Task[];
  onToggle: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  const active = tasks.filter((task) => !task.done);
  const done = tasks.filter((task) => task.done);

  return (
    <section className="screen">
      <SectionHeader title="Задачи" subtitle={`${active.length} активных`} actionLabel="Добавить задачу" onAction={onAdd} />

      <div className="list-stack">
        {active.length ? (
          active.map((task) => <TaskRow key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />)
        ) : (
          <EmptyState title="Свободный день" text="Добавьте первую задачу, когда появится фокус." />
        )}
      </div>

      <h2 className="subheading">Выполнено</h2>
      <div className="list-stack compact">
        {done.length ? (
          done.map((task) => <TaskRow key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />)
        ) : (
          <EmptyState title="Пока пусто" text="Закрытые задачи появятся здесь." />
        )}
      </div>
    </section>
  );
}

function TaskRow({ task, onToggle, onDelete }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <article className={`task-row ${task.done ? "done" : ""}`}>
      <button className="check-target" type="button" onClick={() => onToggle(task.id)} aria-label={task.done ? "Вернуть задачу" : "Выполнить задачу"}>
        <span className="checkbox" aria-hidden="true" />
      </button>
      <span className="task-copy">
        <strong>{task.title}</strong>
        <small>{task.due}</small>
      </span>
      <span className={`priority ${task.priority}`}>{priorityLabel[task.priority]}</span>
      <button className="mini-icon-button danger" type="button" aria-label="Удалить задачу" onClick={() => onDelete(task.id)}>
        <Icon name="trash" size={17} />
      </button>
    </article>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <article className="empty-state">
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}
