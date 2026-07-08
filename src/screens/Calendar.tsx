import { SectionHeader } from "../components/SectionHeader";
import { Icon } from "../components/Icon";
import type { Meeting } from "../types";

export function Calendar({ meetings, onAdd, onDelete }: { meetings: Meeting[]; onAdd: () => void; onDelete: (id: string) => void }) {
  return (
    <section className="screen">
      <SectionHeader title="Календарь" subtitle={`${meetings.length} события сегодня`} actionLabel="Добавить встречу" onAction={onAdd} />

      <div className="timeline">
        {meetings.length ? (
          meetings.map((meeting) => (
            <article className="timeline-item" key={meeting.id}>
              <time>{meeting.time}</time>
              <div>
                <strong>{meeting.title}</strong>
                <p>{meeting.description}</p>
                <span>{meeting.place} · {meeting.reminder}</span>
              </div>
              <button className="mini-icon-button danger" type="button" aria-label="Удалить событие" onClick={() => onDelete(meeting.id)}>
                <Icon name="trash" size={17} />
              </button>
            </article>
          ))
        ) : (
          <article className="empty-state">
            <strong>Нет событий</strong>
            <span>Сегодня календарь открыт для глубокого фокуса.</span>
          </article>
        )}
      </div>
    </section>
  );
}
