import { Drawer } from "../ui/Drawer";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { formatDate } from "../../lib/utils";

export function DecisionDetailDrawer({
  decision,
  isOpen,
  onClose,
  onViewMeeting,
}) {
  if (!decision) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge variant="success" icon={CheckCircle2}>Approved</Badge>;
      case "In Progress":
        return <Badge variant="indigo" icon={Clock}>In Progress</Badge>;
      case "Pending Review":
        return <Badge variant="warning" icon={AlertTriangle}>Pending Review</Badge>;
      case "Superseded":
        return <Badge variant="error">Superseded</Badge>;
      default:
        return <Badge variant="violet">{status}</Badge>;
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={decision.title}
      subtitle={`Recorded on ${formatDate(decision.date)} • ${decision.meetingTitle || decision.meetingId}`}
      width="640px"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        {/* Verification Status & Metadata Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            padding: "0.95rem 1.15rem",
            backgroundColor: "var(--surface-alt)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {getStatusBadge(decision.status)}
            {decision.category && (
              <Badge variant="periwinkle">{decision.category}</Badge>
            )}
          </div>

          <div>
            {decision.verifiedByHuman ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.85rem",
                  fontWeight: 550,
                  color: "var(--semantic-success)",
                }}
              >
                <ShieldCheck size={16} /> Human Verified
              </span>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.85rem",
                  fontWeight: 550,
                  color: "var(--indigo-primary)",
                  backgroundColor: "rgba(166, 177, 225, 0.3)",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "var(--radius-pill)",
                }}
              >
                <Sparkles size={14} /> AI Extraction (Provisional)
              </span>
            )}
          </div>
        </div>

        {/* Core Decision Statement */}
        <div>
          <h4
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "0.5rem",
            }}
          >
            Decision statement
          </h4>
          <div
            style={{
              padding: "1.15rem 1.35rem",
              backgroundColor: "var(--surface-alt)",
              borderLeft: "3.5px solid var(--indigo-primary)",
              borderRadius: "0 var(--radius-md) var(--radius-md) 0",
              fontSize: "1.125rem", /* ~18px SF Pro */
              fontWeight: 550,
              lineHeight: 1.6,
              color: "var(--indigo-primary)",
            }}
          >
            "{decision.statement}"
          </div>
        </div>

        {/* Context and Rationale */}
        <div>
          <h4
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "0.4rem",
            }}
          >
            Context & rationale
          </h4>
          <p style={{ fontSize: "1.05rem", color: "var(--text-primary)", lineHeight: 1.65 }}>
            {decision.context}
          </p>
        </div>

        {/* Supporting Evidence (Transcript Excerpt) */}
        {decision.evidence && (
          <div>
            <h4
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "0.4rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <FileText size={15} color="var(--indigo-primary)" />
              Supporting transcript excerpt
            </h4>
            <div
              style={{
                padding: "1rem 1.25rem",
                backgroundColor: "#FFFFFF",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                fontStyle: "italic",
                fontSize: "0.975rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {decision.evidence}
            </div>
          </div>
        )}

        {/* Source Meeting & Origin */}
        <div
          style={{
            padding: "1.15rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            backgroundColor: "var(--surface-alt)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 550 }}>
              ORIGINATING MEETING
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--indigo-primary)", marginTop: "0.2rem" }}>
              {decision.meetingTitle}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
              Timestamp: {decision.timestamp || "00:00:00"}
            </div>
          </div>

          {onViewMeeting && (
            <Button
              variant="outline"
              size="sm"
              icon={ExternalLink}
              onClick={() => onViewMeeting(decision.meetingId)}
            >
              View meeting
            </Button>
          )}
        </div>

        {/* Responsibility details */}
        {decision.owner && (
          <div
            style={{
              padding: "1rem 1.15rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 550 }}>
              DECISION OWNER
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "0.2rem" }}>
              {decision.owner}
            </div>
            {decision.ownerRole && (
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {decision.ownerRole}
              </div>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}
