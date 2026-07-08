import { Icon } from "../components/Icon";
import { SectionHeader } from "../components/SectionHeader";
import type { ReactNode } from "react";
import type { AppState, EntryType } from "../types";

export function Records({
  state,
  onAdd,
  onDelete
}: {
  state: AppState;
  onAdd: (type: EntryType) => void;
  onDelete: (type: EntryType, id: string) => void;
}) {
  return (
    <section className="screen">
      <SectionHeader title="Журнал" subtitle="идеи, заметки, цели" actionLabel="Добавить заметку" onAction={() => onAdd("note")} />

      <div className="quick-row">
        <button className="quick-action" type="button" onClick={() => onAdd("idea")}>
          <Icon name="idea" size={18} />
          <span>Идея</span>
        </button>
        <button className="quick-action" type="button" onClick={() => onAdd("note")}>
          <Icon name="note" size={18} />
          <span>Заметка</span>
        </button>
        <button className="quick-action" type="button" onClick={() => onAdd("finance")}>
          <Icon name="finance" size={18} />
          <span>Финансы</span>
        </button>
        <button className="quick-action" type="button" onClick={() => onAdd("goal")}>
          <Icon name="goal" size={18} />
          <span>Цель</span>
        </button>
      </div>

      <JournalSection title="Идеи" empty="Новые идеи появятся здесь.">
        {state.ideas.map((idea) => (
          <article className="record-row" key={idea.id}>
            <div>
              <strong>{idea.title}</strong>
              <span>#{idea.tag}</span>
            </div>
            <button className="mini-icon-button danger" type="button" aria-label="Удалить идею" onClick={() => onDelete("idea", idea.id)}>
              <Icon name="trash" size={17} />
            </button>
          </article>
        ))}
      </JournalSection>

      <JournalSection title="Заметки" empty="Короткие наблюдения и мысли будут тут.">
        {state.notes.map((note) => (
          <article className="record-row tall" key={note.id}>
            <div>
              <strong>{note.title}</strong>
              <span>{note.body}</span>
            </div>
            <button className="mini-icon-button danger" type="button" aria-label="Удалить заметку" onClick={() => onDelete("note", note.id)}>
              <Icon name="trash" size={17} />
            </button>
          </article>
        ))}
      </JournalSection>

      <JournalSection title="Цели" empty="Добавьте цель, чтобы держать длинный фокус.">
        {state.goals.map((goal) => (
          <article className="record-row" key={goal.id}>
            <div>
              <strong>{goal.title}</strong>
              <span>{goal.progress}% прогресс</span>
            </div>
            <button className="mini-icon-button danger" type="button" aria-label="Удалить цель" onClick={() => onDelete("goal", goal.id)}>
              <Icon name="trash" size={17} />
            </button>
          </article>
        ))}
      </JournalSection>
    </section>
  );
}

function JournalSection({ title, empty, children }: { title: string; empty: string; children: ReactNode }) {
  const hasItems = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <section className="journal-section">
      <h2 className="subheading">{title}</h2>
      <div className="list-stack">
        {hasItems ? (
          children
        ) : (
          <article className="empty-state">
            <strong>Пока пусто</strong>
            <span>{empty}</span>
          </article>
        )}
      </div>
    </section>
  );
}
