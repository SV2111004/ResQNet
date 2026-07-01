import { FiArrowUp, FiArrowDown } from "react-icons/fi";

// Backward compatible: existing callers only pass {title, value} and get the
// same card, just better looking. New optional props (icon, accent, trend)
// let new usages add more context without any breaking changes.
const ACCENT_MAP = {
  red: { text: "text-[var(--accent-emergency)]", bg: "bg-[var(--accent-emergency-dim)]" },
  teal: { text: "text-[var(--accent-safe)]", bg: "bg-[var(--accent-safe-dim)]" },
  blue: { text: "text-[var(--accent-info)]", bg: "bg-[var(--accent-info-dim)]" },
  amber: { text: "text-[var(--accent-warning)]", bg: "bg-[var(--accent-warning-dim)]" },
};

function StatCard({ title, value, icon: Icon, accent = "blue", trend }) {
  const colors = ACCENT_MAP[accent] || ACCENT_MAP.blue;

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 transition-colors hover:border-[var(--border-strong)]">
      <div className="flex items-start justify-between">
        <p className="text-[var(--text-muted)] text-sm">{title}</p>
        {Icon && (
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}>
            <Icon className={colors.text} size={16} />
          </span>
        )}
      </div>

      <h2 className="text-3xl font-bold font-display mt-2">{value}</h2>

      {trend !== undefined && trend !== null && (
        <div
          className={`flex items-center gap-1 text-xs mt-2 ${
            trend >= 0 ? "text-[var(--accent-safe)]" : "text-[var(--accent-emergency)]"
          }`}
        >
          {trend >= 0 ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
          {Math.abs(trend)}% vs last week
        </div>
      )}
    </div>
  );
}

export default StatCard;
