import {
  AlertTriangle,
  Upload,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { formatDate } from "../lib/utils";

export function OverviewPage({
  decisions = [],
  meetings = [],
  actions = [],
  questions = [],
  conflicts = [],
  onNavigate,
  onOpenUpload,
  onSelectDecision,
  onSelectMeeting,
  onToggleActionStatus,
}) {
  // Items that genuinely require human attention
  const activeConflicts = conflicts.filter(
    (c) => c.status !== "Dismissed" && c.status !== "Resolved"
  );
  const pendingActions = actions.filter((a) => a.status !== "Completed");
  const openQuestions = questions.filter((q) => q.status !== "Resolved");

  const totalNeedsAttention =
    activeConflicts.length + pendingActions.length + openQuestions.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.75rem" }}>
      {/* Editorial Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.25rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.15rem",
              fontWeight: 650,
              color: "var(--indigo-primary)",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Overview
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              marginTop: "0.35rem",
            }}
          >
            Institutional memory, verified decisions, and items requiring attention.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Upload}
          onClick={onOpenUpload}
        >
          Upload meeting
        </Button>
      </div>

      {/* SECTION A: Needs Attention */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 600, color: "var(--indigo-primary)" }}>
              Needs attention
            </h2>
            {totalNeedsAttention > 0 && (
              <Badge variant="warning" style={{ fontSize: "0.8rem" }}>
                {totalNeedsAttention} items
              </Badge>
            )}
          </div>
        </div>

        {totalNeedsAttention === 0 ? (
          <div
            style={{
              padding: "2rem",
              backgroundColor: "#FFFFFF",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              color: "var(--text-secondary)",
            }}
          >
            <CheckCircle2 size={20} color="var(--semantic-success)" />
            <span style={{ fontSize: "1rem" }}>
              All commitments are in harmony. Nothing currently requires team review.
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Conflicts needing review */}
            {activeConflicts.map((conflict) => (
              <div
                key={conflict.id}
                onClick={() => onNavigate("conflicts")}
                className="glass-card glass-card-hover"
                style={{
                  padding: "1.2rem 1.4rem",
                  backgroundColor: "#FFFFFF",
                  borderLeft: "4px solid var(--semantic-warning)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", minWidth: 0 }}>
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
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--semantic-warning)", textTransform: "uppercase" }}>
                        Potential Conflict
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>• {conflict.id}</span>
                    </div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--indigo-primary)", marginTop: "0.15rem" }}>
                      {conflict.title}
                    </h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                      {conflict.explanation}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("conflicts");
                  }}
                  icon={ArrowRight}
                >
                  Review
                </Button>
              </div>
            ))}

            {/* Top pending action items */}
            {pendingActions.slice(0, 2).map((action) => (
              <div
                key={action.id}
                style={{
                  padding: "1rem 1.4rem",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", minWidth: 0 }}>
                  <button
                    onClick={() => onToggleActionStatus(action.id)}
                    aria-label="Complete task"
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "5px",
                      border: "2px solid var(--accent-periwinkle)",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: "0.975rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      {action.task}
                    </div>
                    <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                      Responsible: <strong>{action.owner}</strong> • Due: {formatDate(action.dueDate)}
                    </div>
                  </div>
                </div>

                <Badge variant={action.priority === "High" ? "warning" : "indigo"}>
                  {action.priority || "Normal"}
                </Badge>
              </div>
            ))}

            {/* Open questions */}
            {openQuestions.slice(0, 1).map((q) => (
              <div
                key={q.id}
                onClick={() => onNavigate("questions")}
                className="glass-card glass-card-hover"
                style={{
                  padding: "1rem 1.4rem",
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <HelpCircle size={18} color="var(--indigo-primary)" />
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
                      Unresolved Inquiry
                    </div>
                    <div style={{ fontSize: "0.975rem", fontWeight: 600, color: "var(--indigo-primary)" }}>
                      {q.question}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: "0.85rem", color: "var(--indigo-primary)", fontWeight: 550 }}>
                  Inspect →
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION B: Recent Decisions */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 600, color: "var(--indigo-primary)" }}>
              Recent decisions
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
              Latest commitments and policy choices extracted from meetings.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("decisions")}
          >
            All decisions →
          </Button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {decisions.slice(0, 4).map((decision) => (
            <div
              key={decision.id}
              onClick={() => onSelectDecision(decision)}
              className="glass-card glass-card-hover"
              style={{
                padding: "1.15rem 1.4rem",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1.25rem",
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "var(--indigo-primary)",
                    lineHeight: 1.35,
                  }}
                >
                  {decision.title}
                </h3>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.3rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span>{decision.meetingTitle || decision.meetingId}</span>
                  <span>•</span>
                  <span>{formatDate(decision.date)}</span>
                  {decision.owner && (
                    <>
                      <span>•</span>
                      <span>Owner: {decision.owner}</span>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                {decision.status && (
                  <Badge
                    variant={
                      decision.status === "Approved"
                        ? "success"
                        : decision.status === "Superseded"
                        ? "error"
                        : decision.status === "In Progress"
                        ? "indigo"
                        : "warning"
                    }
                  >
                    {decision.status}
                  </Badge>
                )}
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION C: Recent Meetings */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 600, color: "var(--indigo-primary)" }}>
              Recent meetings
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
              Sessions synced with audio transcripts and institutional notes.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("meetings")}
          >
            All meetings →
          </Button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {meetings.slice(0, 3).map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => onSelectMeeting(meeting)}
              className="glass-card glass-card-hover"
              style={{
                padding: "1.15rem 1.4rem",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1.25rem",
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--indigo-primary)" }}>
                  {meeting.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.25rem",
                    lineHeight: 1.5,
                  }}
                >
                  {meeting.summary}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
                    {formatDate(meeting.date)}
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--indigo-primary)", marginTop: "0.1rem" }}>
                    {meeting.decisionsCount} {meeting.decisionsCount === 1 ? "decision" : "decisions"}
                  </div>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
