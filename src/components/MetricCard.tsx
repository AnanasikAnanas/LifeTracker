import { Icon } from "./Icon";
import type { EntryType, View } from "../types";

export function MetricCard({
  title,
  value,
  caption,
  icon,
  accent = "blue",
  wide = false,
  onClick
}: {
  title: string;
  value: string;
  caption: string;
  icon: EntryType | View | "spark" | "calendar" | "meal" | "habit" | "target";
  accent?: "blue" | "violet" | "mint" | "amber" | "rose";
  wide?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className={`card-icon ${accent}`}>
        <Icon name={icon} />
      </div>
      <div>
        <p className="eyebrow">{title}</p>
        <strong>{value}</strong>
        <span>{caption}</span>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button className={`metric-card ${wide ? "wide" : ""}`} onClick={onClick} type="button">
        {content}
      </button>
    );
  }

  return <article className={`metric-card ${wide ? "wide" : ""}`}>{content}</article>;
}
