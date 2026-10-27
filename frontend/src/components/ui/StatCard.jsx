import { cn } from "../../lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  accentColor = "var(--accent-periwinkle)",
  className,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card p-5 relative overflow-hidden",
        onClick && "cursor-pointer glass-card-hover",
        className
      )}
      style={{
        padding: "1.25rem 1.4rem",
        backgroundColor: "#FFFFFF",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: accentColor,
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {label}
          </span>
          <div
            style={{
              fontSize: "1.9rem",
              fontWeight: 800,
              color: "var(--indigo-primary)",
              lineHeight: 1.2,
              marginTop: "0.4rem",
            }}
          >
            {value}
          </div>
        </div>

        <div
          style={{
            padding: "0.65rem",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--section-subtle)",
            color: "var(--indigo-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {Icon && <Icon size={20} />}
        </div>
      </div>

      {trendLabel && (
        <div
          style={{
            marginTop: "0.75rem",
            paddingTop: "0.6rem",
            borderTop: "1px solid var(--border-subtle)",
            fontSize: "0.775rem",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          {trend && (
            <span
              style={{
                fontWeight: 700,
                color: trend.startsWith("+")
                  ? "var(--semantic-success)"
                  : "var(--text-primary)",
              }}
            >
              {trend}
            </span>
          )}
          <span>{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
