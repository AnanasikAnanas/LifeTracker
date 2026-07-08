import { MetricCard } from "../components/MetricCard";
import { ProgressBar } from "../components/ProgressBar";
import { SectionHeader } from "../components/SectionHeader";
import { Icon } from "../components/Icon";
import type { AppState } from "../types";

const weeklyActivity = [44, 58, 72, 63, 88, 69, 81];
const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0
});

export function Stats({
  state,
  completedTasks,
  completedHabits,
  eatenCalories,
  financeIncome,
  financeExpense,
  dayProgress,
  onExport,
  onReset
}: {
  state: AppState;
  completedTasks: number;
  completedHabits: number;
  eatenCalories: number;
  financeIncome: number;
  financeExpense: number;
  dayProgress: number;
  onExport: () => void;
  onReset: () => void;
}) {
  const habitProgress = state.habits.length ? Math.round((completedHabits / state.habits.length) * 100) : 0;
  const financeBalance = financeIncome - financeExpense;

  return (
    <section className="screen">
      <SectionHeader title="Статистика" subtitle="короткая аналитика" />

      <article className="analytics-hero">
        <p className="eyebrow">Индекс активности</p>
        <h2>{dayProgress}%</h2>
        <ProgressBar value={dayProgress} />
      </article>

      <div className="bento-grid">
        <MetricCard title="Задачи" value={String(completedTasks)} caption="выполнено" icon="task" accent="blue" />
        <MetricCard title="Идеи" value={String(state.ideas.length)} caption="записано" icon="spark" accent="violet" />
        <MetricCard title="Расходы" value={moneyFormatter.format(financeExpense)} caption={`доход ${moneyFormatter.format(financeIncome)}`} icon="finance" accent="amber" />
        <MetricCard title="Калории" value={String(eatenCalories)} caption="сегодня" icon="meal" accent="mint" />
      </div>

      <article className="chart-card">
        <div>
          <p className="eyebrow">Неделя</p>
          <h2>Активность</h2>
        </div>
        <div className="bar-chart" aria-label="Активность за неделю">
          {weeklyActivity.map((value, index) => (
            <span key={index} style={{ height: `${value}%` }} />
          ))}
        </div>
      </article>

      <article className="focus-card">
        <div>
          <p className="eyebrow">Финансовый итог</p>
          <h2>{moneyFormatter.format(financeBalance)}</h2>
        </div>
        <ProgressBar value={financeIncome ? Math.min(Math.round((financeExpense / financeIncome) * 100), 100) : 0} label="доля расходов" />
      </article>

      <article className="focus-card">
        <div>
          <p className="eyebrow">Привычки</p>
          <h2>{completedHabits}/{state.habits.length} выполнено</h2>
        </div>
        <ProgressBar value={habitProgress} label={`${habitProgress}%`} />
      </article>

      <article className="data-card">
        <div>
          <p className="eyebrow">Данные</p>
          <h2>Резервная копия</h2>
        </div>
        <div className="data-actions">
          <button className="secondary-action" type="button" onClick={onExport}>
            <Icon name="download" size={18} />
            <span>Экспорт</span>
          </button>
          <button className="secondary-action danger" type="button" onClick={onReset}>
            <Icon name="reset" size={18} />
            <span>Сброс</span>
          </button>
        </div>
      </article>
    </section>
  );
}
