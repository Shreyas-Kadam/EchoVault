import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { HelpCircle, User, Calendar, CheckCircle2, RotateCcw } from "lucide-react";
import { formatDate } from "../../lib/utils";

export function QuestionCard({
  question,
  onToggleResolved,
}) {
  const isResolved = question.status === "Resolved";

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.25rem 1.4rem",
        backgroundColor: "#FFFFFF",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", flex: 1 }}>
          <div
            style={{
              padding: "0.4rem",
              borderRadius: "var(--radius-sm)",
              backgroundColor: isResolved ? "var(--semantic-success-bg)" : "var(--semantic-warning-bg)",
              color: isResolved ? "var(--semantic-success)" : "var(--semantic-warning)",
              marginTop: "2px",
              flexShrink: 0,
            }}
          >
            <HelpCircle size={17} />
          </div>
          <div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.725rem",
                color: "var(--text-muted)",
              }}
            >
              {question.id}
            </span>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: isResolved ? "var(--text-secondary)" : "var(--indigo-primary)",
                lineHeight: 1.45,
                marginTop: "0.15rem",
              }}
            >
              {question.question}
            </h3>
          </div>
        </div>

        <Badge variant={isResolved ? "success" : question.status === "In Discussion" ? "indigo" : "warning"}>
          {question.status}
        </Badge>
      </div>

      {question.notes && (
        <div
          style={{
            padding: "0.65rem 0.85rem",
            backgroundColor: "var(--surface-alt)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
          }}
        >
          <span style={{ fontWeight: 600, color: "var(--indigo-primary)" }}>Investigation note: </span>
          {question.notes}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "0.65rem",
          borderTop: "1px solid var(--border-subtle)",
          fontSize: "0.775rem",
          color: "var(--text-secondary)",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <User size={12} color="var(--indigo-primary)" />
            Assigned: <strong>{question.owner || "Unassigned"}</strong>
          </span>
          <span>•</span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Calendar size={12} color="var(--indigo-primary)" />
            Raised: {formatDate(question.date)}
          </span>
        </div>

        {onToggleResolved && (
          <Button
            variant="outline"
            size="sm"
            icon={isResolved ? RotateCcw : CheckCircle2}
            onClick={() => onToggleResolved(question.id)}
          >
            {isResolved ? "Reopen Question" : "Mark as Resolved"}
          </Button>
        )}
      </div>
    </div>
  );
}
