import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { CheckCircle2, Clock, AlertTriangle, ChevronRight, Sparkles } from "lucide-react";
import { formatDate } from "../../lib/utils";

export function DecisionTable({
  decisions = [],
  onSelectDecision,
  compact = false,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge variant="success" icon={CheckCircle2}>Approved</Badge>;
      case "In Progress":
        return <Badge variant="indigo" icon={Clock}>In Progress</Badge>;
      case "Pending Review":
        return <Badge variant="warning" icon={AlertTriangle}>Review</Badge>;
      case "Superseded":
        return <Badge variant="error">Superseded</Badge>;
      default:
        return <Badge variant="violet">{status}</Badge>;
    }
  };

  return (
    <div
      style={{
        overflowX: "auto",
        width: "100%",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-subtle)",
        backgroundColor: "#FFFFFF",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          fontSize: "0.85rem",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "var(--surface-alt)",
              borderBottom: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <th style={{ padding: "0.85rem 1.15rem" }}>ID</th>
            <th style={{ padding: "0.85rem 1.15rem" }}>Decision Title</th>
            {!compact && <th style={{ padding: "0.85rem 1.15rem" }}>Source Meeting</th>}
            {!compact && <th style={{ padding: "0.85rem 1.15rem" }}>Owner</th>}
            <th style={{ padding: "0.85rem 1.15rem" }}>Status</th>
            <th style={{ padding: "0.85rem 1.15rem" }}>Date</th>
            <th style={{ padding: "0.85rem 1.15rem", textAlign: "right" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {decisions.map((decision) => (
            <tr
              key={decision.id}
              onClick={() => onSelectDecision(decision)}
              style={{
                borderBottom: "1px solid var(--border-subtle)",
                cursor: "pointer",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(244, 238, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {/* ID */}
              <td style={{ padding: "0.9rem 1.15rem", whiteSpace: "nowrap" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.775rem",
                    fontWeight: 600,
                    color: "var(--indigo-primary)",
                    backgroundColor: "var(--section-subtle)",
                    padding: "0.2rem 0.45rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {decision.id}
                </span>
              </td>

              {/* Title & snippet */}
              <td style={{ padding: "0.9rem 1.15rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {decision.title}
                  </span>
                  {decision.isAiExtracted && !decision.verifiedByHuman && (
                    <span title="AI Extracted Suggestion">
                      <Sparkles size={13} color="var(--accent-periwinkle)" />
                    </span>
                  )}
                </div>
                {!compact && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      marginTop: "0.2rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "420px",
                    }}
                  >
                    {decision.statement}
                  </div>
                )}
              </td>

              {/* Source Meeting */}
              {!compact && (
                <td style={{ padding: "0.9rem 1.15rem", color: "var(--text-secondary)", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                  {decision.meetingTitle || decision.meetingId}
                </td>
              )}

              {/* Owner */}
              {!compact && (
                <td style={{ padding: "0.9rem 1.15rem", whiteSpace: "nowrap" }}>
                  <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                    {decision.owner}
                  </span>
                </td>
              )}

              {/* Status */}
              <td style={{ padding: "0.9rem 1.15rem", whiteSpace: "nowrap" }}>
                {getStatusBadge(decision.status)}
              </td>

              {/* Date */}
              <td style={{ padding: "0.9rem 1.15rem", whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                {formatDate(decision.date)}
              </td>

              {/* Row Action */}
              <td style={{ padding: "0.9rem 1.15rem", textAlign: "right", whiteSpace: "nowrap" }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDecision(decision);
                  }}
                  icon={ChevronRight}
                >
                  Inspect
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
