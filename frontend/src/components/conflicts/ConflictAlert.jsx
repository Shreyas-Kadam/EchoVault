import { useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function ConflictAlert({
  conflict,
  onResolve,
  onDismiss,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: "var(--radius-lg)",
        backgroundColor: "#FFFFFF",
        border: "1px solid var(--border-subtle)",
        overflow: "hidden",
      }}
    >
      {/* Top Banner Header */}
      <div
        style={{
          padding: "1.25rem 1.6rem",
          backgroundColor: "rgba(254, 249, 195, 0.35)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem" }}>
          <div
            style={{
              padding: "0.45rem",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--semantic-warning-bg)",
              color: "var(--semantic-warning)",
              marginTop: "2px",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={18} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.775rem",
                  fontWeight: 600,
                  color: "var(--semantic-warning)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Potential Contradiction
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>• Requires Human Review</span>
            </div>
            <h3
              style={{
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "var(--indigo-primary)",
                marginTop: "0.2rem",
              }}
            >
              {conflict.title}
            </h3>
          </div>
        </div>

        <Badge variant={conflict.status === "Needs Human Review" ? "warning" : "indigo"}>
          {conflict.status}
        </Badge>
      </div>

      {/* Comparison: Current Proposal vs Previous Decision */}
      <div style={{ padding: "1.4rem 1.6rem", display: "flex", flexDirection: "column", gap: "1.15rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.25rem",
          }}
          className="conflict-grid"
        >
          {/* New Proposal */}
          <div
            style={{
              padding: "1.15rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--surface-alt)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--indigo-primary)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: "0.4rem",
              }}
            >
              CURRENT PROPOSAL
            </div>
            <div style={{ fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.6 }}>
              {conflict.currentProposal}
            </div>
          </div>

          {/* Previous Decision */}
          <div
            style={{
              padding: "1.15rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--surface-alt)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "var(--semantic-warning)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: "0.4rem",
              }}
            >
              PREVIOUS DECISION (INSTITUTIONAL RECORD)
            </div>
            <div style={{ fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.6 }}>
              {conflict.previousDecision}
            </div>
          </div>
        </div>

        {/* Semantic Inconsistency Explanation */}
        <div
          style={{
            padding: "1rem 1.15rem",
            backgroundColor: "#FFFFFF",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            fontSize: "0.95rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "var(--indigo-primary)" }}>Why this flagged: </strong>
          {conflict.explanation}
        </div>

        {/* Supporting Evidence */}
        {isExpanded && conflict.evidence && (
          <div
            style={{
              padding: "1rem 1.15rem",
              backgroundColor: "var(--surface-alt)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontStyle: "normal", fontWeight: 600, color: "var(--indigo-primary)", marginBottom: "0.3rem" }}>
              Supporting transcript quote:
            </div>
            "{conflict.evidence}"
          </div>
        )}

        {/* Footer Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border-subtle)",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.85rem",
              fontWeight: 550,
              color: "var(--indigo-primary)",
              cursor: "pointer",
            }}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {isExpanded ? "Hide evidence" : "View transcript evidence"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Button
              variant="outline"
              size="sm"
              icon={XCircle}
              onClick={() => onDismiss(conflict.id)}
            >
              Dismiss (No contradiction)
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={CheckCircle2}
              onClick={() => onResolve(conflict.id)}
            >
              Confirm & resolve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
