import { useMemo, useState } from "react";
import { entryTypes } from "../data/mock";
import { Icon } from "../components/Icon";
import { SectionHeader } from "../components/SectionHeader";
import type { EntryType } from "../types";

const defaults: Record<EntryType, Record<string, string>> = {
  task: { title: "", time: "", priority: "medium" },
  idea: { title: "", tag: "" },
  meeting: { title: "", time: "", description: "", place: "", reminder: "" },
  note: { title: "", description: "" },
  meal: { title: "", calories: "", protein: "", fat: "", carbs: "" },
  habit: { title: "", streak: "0", progress: "0" },
  goal: { title: "", progress: "0" }
};

export function AddEntry({
  initialType,
  onAdd,
  onCancel
}: {
  initialType: EntryType;
  onAdd: (type: EntryType, payload: Record<string, string>) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<EntryType>(initialType);
  const [payload, setPayload] = useState<Record<string, string>>(defaults[initialType]);

  const fields = useMemo(() => {
    const fieldMap: Record<EntryType, Array<{ name: string; label: string; type?: string; placeholder: string }>> = {
      task: [
        { name: "title", label: "Название", placeholder: "Например: оплатить счет" },
        { name: "time", label: "Срок", placeholder: "18:00" },
        { name: "priority", label: "Приоритет", placeholder: "low / medium / high" }
      ],
      idea: [
        { name: "title", label: "Идея", placeholder: "Сформулируйте мысль" },
        { name: "tag", label: "Тег", placeholder: "product" }
      ],
      meeting: [
        { name: "title", label: "Название", placeholder: "Встреча с..." },
        { name: "time", label: "Время", type: "time", placeholder: "12:00" },
        { name: "description", label: "Описание", placeholder: "Повестка" },
        { name: "place", label: "Место", placeholder: "Telegram" },
        { name: "reminder", label: "Напоминание", placeholder: "за 10 минут" }
      ],
      note: [
        { name: "title", label: "Заголовок", placeholder: "Коротко о заметке" },
        { name: "description", label: "Текст", placeholder: "Что важно запомнить" }
      ],
      meal: [
        { name: "title", label: "Блюдо", placeholder: "Паста с курицей" },
        { name: "calories", label: "Калории", type: "number", placeholder: "520" },
        { name: "protein", label: "Белки", type: "number", placeholder: "34" },
        { name: "fat", label: "Жиры", type: "number", placeholder: "18" },
        { name: "carbs", label: "Углеводы", type: "number", placeholder: "62" }
      ],
      habit: [
        { name: "title", label: "Привычка", placeholder: "Медитация" },
        { name: "streak", label: "Серия дней", type: "number", placeholder: "0" },
        { name: "progress", label: "Прогресс", type: "number", placeholder: "0" }
      ],
      goal: [
        { name: "title", label: "Цель", placeholder: "Что хотите улучшить" },
        { name: "progress", label: "Прогресс", type: "number", placeholder: "0" }
      ]
    };

    return fieldMap[type];
  }, [type]);

  function switchType(nextType: EntryType) {
    setType(nextType);
    setPayload(defaults[nextType]);
  }

  return (
    <section className="screen">
      <SectionHeader title="Новая запись" subtitle="быстрое добавление" />

      <div className="type-grid">
        {entryTypes.map((entry) => (
          <button
            className={`type-card ${type === entry.id ? "selected" : ""}`}
            key={entry.id}
            onClick={() => switchType(entry.id)}
            type="button"
          >
            <Icon name={entry.id} />
            <strong>{entry.title}</strong>
            <span>{entry.caption}</span>
          </button>
        ))}
      </div>

      <form
        className="form-card"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(type, payload);
        }}
      >
        {fields.map((field) => (
          <label className="field" key={field.name}>
            <span>{field.label}</span>
            <input
              type={field.type || "text"}
              value={payload[field.name] || ""}
              placeholder={field.placeholder}
              onChange={(event) => setPayload((current) => ({ ...current, [field.name]: event.target.value }))}
            />
          </label>
        ))}

        <div className="form-actions">
          <button className="ghost-button" type="button" onClick={onCancel}>
            Отмена
          </button>
          <button className="primary-button" type="submit">
            Сохранить
          </button>
        </div>
      </form>
    </section>
  );
}
