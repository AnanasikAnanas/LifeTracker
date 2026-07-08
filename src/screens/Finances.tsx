import { Icon } from "../components/Icon";
import { ProgressBar } from "../components/ProgressBar";
import { SectionHeader } from "../components/SectionHeader";
import type { FinanceRecord } from "../types";

const currency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0
});

export function Finances({
  finances,
  budgets,
  onAdd,
  onDelete,
  onUpdateBudget
}: {
  finances: FinanceRecord[];
  budgets: Record<string, number>;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdateBudget: (category: string, value: number) => void;
}) {
  const income = finances.filter((item) => item.kind === "income").reduce((sum, item) => sum + item.amount, 0);
  const expense = finances.filter((item) => item.kind === "expense").reduce((sum, item) => sum + item.amount, 0);
  const balance = income - expense;
  const expenseRatio = income ? Math.min(Math.round((expense / income) * 100), 100) : 0;
  const categories = Array.from(new Set([...Object.keys(budgets), ...finances.map((item) => item.category)]));

  return (
    <section className="screen">
      <SectionHeader title="Финансы" subtitle="доходы и расходы" actionLabel="Добавить операцию" actionIcon="finance" onAction={onAdd} />

      <article className="finance-summary">
        <div>
          <p className="eyebrow">Баланс дня</p>
          <h2>{currency.format(balance)}</h2>
        </div>
        <div className="finance-split">
          <span>Доход {currency.format(income)}</span>
          <span>Расход {currency.format(expense)}</span>
        </div>
        <ProgressBar value={expenseRatio} label={`Расходовано ${expenseRatio}% от дохода`} />
      </article>

      <section className="budget-panel">
        <div>
          <p className="eyebrow">Лимиты</p>
          <h2>Бюджеты категорий</h2>
        </div>
        <div className="budget-list">
          {categories.map((category) => {
            const spent = finances
              .filter((item) => item.kind === "expense" && item.category === category)
              .reduce((sum, item) => sum + item.amount, 0);
            const limit = budgets[category] || 0;
            const progress = limit ? Math.min(Math.round((spent / limit) * 100), 100) : 0;

            return (
              <article className="budget-row" key={category}>
                <div>
                  <strong>{category}</strong>
                  <span>{currency.format(spent)} из {currency.format(limit)}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={limit}
                  aria-label={`Лимит ${category}`}
                  onChange={(event) => onUpdateBudget(category, Number(event.target.value || 0))}
                />
                <ProgressBar value={progress} label={`${progress}%`} />
              </article>
            );
          })}
        </div>
      </section>

      <div className="list-stack">
        {finances.length ? (
          finances.map((item) => (
            <article className={`finance-row ${item.kind}`} key={item.id}>
              <div className="finance-kind">
                <Icon name={item.kind === "income" ? "download" : "finance"} size={18} />
              </div>
              <div>
                <strong>{item.title}</strong>
                <span>
                  {item.category} · {item.account}
                </span>
                {item.note ? <small>{item.note}</small> : null}
              </div>
              <b>{item.kind === "income" ? "+" : "-"}{currency.format(item.amount)}</b>
              <button className="mini-icon-button danger" type="button" aria-label="Удалить операцию" onClick={() => onDelete(item.id)}>
                <Icon name="trash" size={17} />
              </button>
            </article>
          ))
        ) : (
          <article className="empty-state">
            <strong>Операций нет</strong>
            <span>Добавьте доход или расход голосом или вручную.</span>
          </article>
        )}
      </div>
    </section>
  );
}
