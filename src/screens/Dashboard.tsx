import { MetricCard } from "../components/MetricCard";
import { ProgressBar } from "../components/ProgressBar";
import { Icon } from "../components/Icon";
import type { TelegramUser } from "../telegram";
import type { AppState, EntryType, View } from "../types";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  weekday: "long",
  day: "numeric",
  month: "long"
});

const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0
});

export function Dashboard({
  state,
  completedTasks,
  completedHabits,
  dayProgress,
  eatenCalories,
  financeIncome,
  financeExpense,
  user,
  isTelegram,
  onAdd,
  onNavigate
}: {
  state: AppState;
  completedTasks: number;
  completedHabits: number;
  dayProgress: number;
  eatenCalories: number;
  financeIncome: number;
  financeExpense: number;
  user?: TelegramUser;
  isTelegram: boolean;
  onAdd: (type: EntryType) => void;
  onNavigate: (view: View) => void;
}) {
  const nextMeeting = state.meetings[0];
  const remainingTasks = state.tasks.length - completedTasks;
  const habitPercent = state.habits.length ? Math.round((completedHabits / state.habits.length) * 100) : 0;
  const displayName = user?.first_name || user?.username || "Егор";
  const balance = financeIncome - financeExpense;

  return (
    <section className="screen dashboard">
      <header className="hero-panel">
        <div className="hero-topline">
          <span>{dateFormatter.format(new Date())}</span>
          <span className="status-dot">{isTelegram ? "Telegram" : "demo"}</span>
        </div>
        <div className="hero-copy">
          <h1>Добрый день, {displayName}</h1>
          <p>
            Сегодня осталось {remainingTasks} задач, следующая встреча {nextMeeting ? `в ${nextMeeting.time}` : "не запланирована"}.
          </p>
        </div>
        <div className="day-progress">
          <div>
            <span>Прогресс дня</span>
            <strong>{dayProgress}%</strong>
          </div>
          <ProgressBar value={dayProgress} />
        </div>
      </header>

      <div className="quick-row" aria-label="Быстрые действия">
        {[
          ["task", "Задача"],
          ["note", "Заметка"],
          ["finance", "Финансы"],
          ["meal", "Еда"]
        ].map(([type, label]) => (
          <button className="quick-action" key={type} onClick={() => onAdd(type as EntryType)} type="button">
            <Icon name={type as EntryType} size={18} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="bento-grid">
        <MetricCard
          title="Задачи"
          value={`${completedTasks}/${state.tasks.length}`}
          caption={remainingTasks ? `${remainingTasks} в работе` : "Все закрыто"}
          icon="task"
          accent="blue"
          onClick={() => onNavigate("tasks")}
        />
        <MetricCard
          title="Финансы"
          value={moneyFormatter.format(balance)}
          caption={`расход ${moneyFormatter.format(financeExpense)}`}
          icon="finance"
          accent={balance >= 0 ? "mint" : "rose"}
          onClick={() => onNavigate("finances")}
        />
        <MetricCard
          title="Встречи"
          value={nextMeeting?.time ?? "нет"}
          caption={nextMeeting?.title ?? "чистый день"}
          icon="calendar"
          accent="mint"
          wide
          onClick={() => onNavigate("calendar")}
        />
        <MetricCard
          title="Калории"
          value={`${eatenCalories}`}
          caption={`из ${state.calorieGoal} ккал`}
          icon="meal"
          accent="amber"
          onClick={() => onNavigate("nutrition")}
        />
        <MetricCard
          title="Привычки"
          value={`${habitPercent}%`}
          caption={`${completedHabits}/${state.habits.length} сегодня`}
          icon="habit"
          accent="rose"
          onClick={() => onNavigate("habits")}
        />
      </div>

      <button className="focus-card actionable" type="button" onClick={() => onNavigate("records")}>
        <div>
          <p className="eyebrow">Фокус</p>
          <h2>{state.goals[0]?.title ?? "Добавьте главную цель"}</h2>
        </div>
        <ProgressBar value={state.goals[0]?.progress ?? 0} label={`${state.goals[0]?.progress ?? 0}%`} />
      </button>
    </section>
  );
}
