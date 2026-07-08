import { ProgressBar } from "../components/ProgressBar";
import { SectionHeader } from "../components/SectionHeader";
import { Icon } from "../components/Icon";
import type { Meal } from "../types";

export function Nutrition({
  meals,
  calorieGoal,
  onAdd,
  onDelete,
  onUpdateGoal
}: {
  meals: Meal[];
  calorieGoal: number;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdateGoal: (value: number) => void;
}) {
  const calories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const protein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const fat = meals.reduce((sum, meal) => sum + meal.fat, 0);
  const carbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const percent = Math.round((calories / calorieGoal) * 100);

  return (
    <section className="screen">
      <SectionHeader title="Питание" subtitle="калории и БЖУ" actionLabel="Добавить прием пищи" onAction={onAdd} />

      <article className="nutrition-summary">
        <div>
          <p className="eyebrow">Дневная цель</p>
          <h2>{calories} / {calorieGoal} ккал</h2>
        </div>
        <label className="compact-field">
          <span>Цель</span>
          <input type="number" min="1" value={calorieGoal} onChange={(event) => onUpdateGoal(Number(event.target.value || 1))} />
        </label>
        <ProgressBar value={percent} label={`${Math.min(percent, 100)}%`} />
        <div className="macro-grid">
          <span>Б {protein}г</span>
          <span>Ж {fat}г</span>
          <span>У {carbs}г</span>
        </div>
      </article>

      <div className="list-stack">
        {meals.length ? (
          meals.map((meal) => (
            <article className="meal-row" key={meal.id}>
              <div>
                <strong>{meal.title}</strong>
                <span>Б {meal.protein} · Ж {meal.fat} · У {meal.carbs}</span>
              </div>
              <b>{meal.calories}</b>
              <button className="mini-icon-button danger" type="button" aria-label="Удалить прием пищи" onClick={() => onDelete(meal.id)}>
                <Icon name="trash" size={17} />
              </button>
            </article>
          ))
        ) : (
          <article className="empty-state">
            <strong>Приемов пищи нет</strong>
            <span>Добавьте блюдо, чтобы увидеть прогресс дня.</span>
          </article>
        )}
      </div>
    </section>
  );
}
