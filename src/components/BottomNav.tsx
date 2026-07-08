import { Icon } from "./Icon";
import type { View } from "../types";

const items: Array<{ view: View; label: string }> = [
  { view: "home", label: "День" },
  { view: "tasks", label: "Задачи" },
  { view: "add", label: "Добавить" },
  { view: "records", label: "Журнал" },
  { view: "stats", label: "Итоги" }
];

export function BottomNav({ active, onNavigate }: { active: View; onNavigate: (view: View) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      {items.map((item) => (
        <button
          className={`nav-item ${active === item.view ? "active" : ""} ${item.view === "add" ? "primary" : ""}`}
          key={item.view}
          onClick={() => onNavigate(item.view)}
          type="button"
        >
          <Icon name={item.view} size={item.view === "add" ? 24 : 19} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
