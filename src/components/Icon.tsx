import type { EntryType, View } from "../types";

type IconName =
  | EntryType
  | View
  | "check"
  | "spark"
  | "meal"
  | "target"
  | "plus"
  | "note"
  | "calendar"
  | "habit"
  | "trash"
  | "download"
  | "reset"
  | "finance"
  | "mic"
  | "micOff";

const paths: Record<string, string[]> = {
  home: ["M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"],
  add: ["M12 5v14M5 12h14"],
  plus: ["M12 5v14M5 12h14"],
  tasks: ["M7 7h11M7 12h11M7 17h11", "M4 7h.01M4 12h.01M4 17h.01"],
  timeline: ["M12 5v14", "M7 8h10", "M7 12h10", "M7 16h10", "M5 8h.01M5 12h.01M5 16h.01"],
  task: ["M5 12l4 4L19 6"],
  check: ["M5 12l4 4L19 6"],
  calendar: ["M5 7h14v12H5z", "M8 4v5M16 4v5M5 11h14"],
  meeting: ["M5 7h14v12H5z", "M8 4v5M16 4v5M5 11h14"],
  nutrition: ["M7 4v8a5 5 0 0 0 10 0V4", "M12 14v7"],
  meal: ["M7 4v8a5 5 0 0 0 10 0V4", "M12 14v7"],
  finance: ["M4 7h16v12H4z", "M4 10h16", "M16 15h2", "M7 7V5h10v2"],
  finances: ["M4 7h16v12H4z", "M4 10h16", "M16 15h2", "M7 7V5h10v2"],
  habits: ["M12 21a7 7 0 0 0 7-7c0-5-7-11-7-11S5 9 5 14a7 7 0 0 0 7 7z"],
  habit: ["M12 21a7 7 0 0 0 7-7c0-5-7-11-7-11S5 9 5 14a7 7 0 0 0 7 7z"],
  stats: ["M5 19V9M12 19V5M19 19v-7"],
  records: ["M5 5h14v14H5z", "M8 9h8M8 13h8M8 17h5"],
  idea: ["M9 18h6", "M10 22h4", "M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3z"],
  spark: ["M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9z"],
  note: ["M6 4h9l3 3v13H6z", "M14 4v4h4M9 13h6M9 17h6"],
  goal: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z", "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"],
  target: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z", "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"],
  trash: ["M4 7h16", "M10 11v6M14 11v6", "M6 7l1 14h10l1-14", "M9 7V4h6v3"],
  download: ["M12 4v10", "M7 10l5 5 5-5", "M5 20h14"],
  reset: ["M4 4v6h6", "M20 20v-6h-6", "M6.5 17.5a8 8 0 0 0 11-11", "M17.5 6.5a8 8 0 0 0-11 11"],
  mic: ["M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v3"],
  micOff: ["M4 4l16 16", "M9 9v3a3 3 0 0 0 5 2.2", "M15 9V6a3 3 0 0 0-5.1-2.1", "M19 10v2a7 7 0 0 1-1.6 4.5", "M5 10v2a7 7 0 0 0 9.2 6.6", "M12 19v3"]
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const iconPaths = paths[name] ?? paths.note;

  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {iconPaths.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
