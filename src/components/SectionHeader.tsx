import { Icon } from "./Icon";
import type { EntryType } from "../types";

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionIcon = "plus",
  onAction
}: {
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionIcon?: EntryType | "plus";
  onAction?: () => void;
}) {
  return (
    <header className="section-header">
      <div>
        <p className="eyebrow">{subtitle}</p>
        <h1>{title}</h1>
      </div>
      {onAction ? (
        <button className="icon-button" type="button" onClick={onAction} aria-label={actionLabel}>
          <Icon name={actionIcon} />
        </button>
      ) : null}
    </header>
  );
}
