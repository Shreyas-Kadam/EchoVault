import { Check } from "lucide-react";
import { formatDate } from "../../lib/utils";

export function ActionItemRow({
  action,
  onToggleStatus,
}) {
  const isCompleted = action.status === "Completed";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 1.25rem",
        backgroundColor: "#FFFFFF",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        transition: "all 0.15s ease",
        gap: "1rem",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent-periwinkle)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", flex: 1, minWidth: 0 }}>
        {/* Accessible Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(action.id);
          }}
          aria-label={isCompleted ? "Mark task incomplete" : "Mark task completed"}
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "6px",
            border: `2px solid ${isCompleted ? "var(--semantic-success)" : "var(--accent-periwinkle)"}`,
            backgroundColor: isCompleted ? "var(--semantic-success)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            marginTop: "2px",
            transition: "all 0.15s ease",
          }}
        >
          {isCompleted && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
        </button>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: "1.05rem",
              fontWeight: 550,
              color: isCompleted ? "var(--text-muted)" : "var(--text-primary)",
              textDecoration: isCompleted ? "line-through" : "none",
              transition: "color 0.15s ease",
            }}
          >
            {action.task}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              marginTop: "0.25rem",
              flexWrap: "wrap",
            }}
          >
            <span>{action.owner}</span>
            <span>•</span>
            <span>Due {formatDate(action.dueDate)}</span>
            {action.meetingTitle && (
              <>
                <span>•</span>
                <span style={{ color: "var(--text-muted)" }}>{action.meetingTitle}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ fontSize: "0.825rem", color: isCompleted ? "var(--semantic-success)" : "var(--text-muted)", fontWeight: 550 }}>
        {isCompleted ? "Completed" : "Pending"}
      </div>
    </div>
  );
}
