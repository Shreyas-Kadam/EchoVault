import { cn } from "../../lib/utils";

export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div
      role="tablist"
      className={cn("flex items-center gap-1 p-1 bg-[var(--section-subtle)] rounded-[var(--radius-md)] border border-[var(--border-subtle)]", className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.25rem",
        backgroundColor: "var(--section-subtle)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.9rem",
              fontSize: "0.825rem",
              fontWeight: 600,
              borderRadius: "var(--radius-sm)",
              transition: "all 0.15s ease",
              backgroundColor: isActive ? "#FFFFFF" : "transparent",
              color: isActive ? "var(--indigo-primary)" : "var(--text-secondary)",
              boxShadow: isActive ? "0 1px 3px rgba(66, 72, 116, 0.1)" : "none",
              border: isActive ? "1px solid rgba(220, 214, 247, 0.8)" : "1px solid transparent",
            }}
          >
            {Icon && <Icon size={14} />}
            {tab.label}
            {tab.count != null && (
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "0.1rem 0.4rem",
                  borderRadius: "9999px",
                  backgroundColor: isActive ? "var(--section-subtle)" : "rgba(220, 214, 247, 0.5)",
                  color: "var(--indigo-primary)",
                  fontWeight: 700,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
