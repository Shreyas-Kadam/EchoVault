import { ConflictAlert } from "../components/conflicts/ConflictAlert";
import { EmptyState } from "../components/ui/EmptyState";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ShieldCheck, HelpCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { formatDate } from "../lib/utils";

export function ConflictsPage({
  conflicts = [],
  questions = [],
  onResolveConflict,
  onDismissConflict,
  onToggleQuestionResolved,
}) {
  const activeConflicts = conflicts.filter(
    (c) => c.status !== "Dismissed" && c.status !== "Resolved"
  );
  const openQuestions = questions.filter((q) => q.status !== "Resolved");

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
            Conflicts & Inquiries
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              marginTop: "0.35rem",
            }}
          >
            Detecting potential policy contradictions and tracking open technical ambiguities.
          </p>
        </div>

        {activeConflicts.length > 0 && (
          <Badge variant="warning">
            {activeConflicts.length} {activeConflicts.length === 1 ? "conflict" : "conflicts"} needing review
          </Badge>
        )}
      </div>

      {/* Conflicts Section */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 600, color: "var(--indigo-primary)" }}>
            Potential policy contradictions
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
            Candidate contradictions between new proposals and past commitments. Requires human verification.
          </p>
        </div>

        {conflicts.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {conflicts.map((conflict) => (
              <ConflictAlert
                key={conflict.id}
                conflict={conflict}
                onResolve={onResolveConflict}
                onDismiss={onDismissConflict}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ShieldCheck}
            title="No policy conflicts detected"
            description="All active initiatives are in harmony with historical organizational memory."
          />
        )}
      </section>

      {/* Open Questions Section */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 600, color: "var(--indigo-primary)" }}>
              Unresolved meeting questions
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
              Technical ambiguities and open questions raised during sessions.
            </p>
          </div>
          {openQuestions.length > 0 && (
            <Badge variant="indigo">{openQuestions.length} open</Badge>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {questions.map((q) => {
            const isResolved = q.status === "Resolved";
            return (
              <div
                key={q.id}
                style={{
                  padding: "1.15rem 1.4rem",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.25rem",
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <HelpCircle size={17} color={isResolved ? "var(--semantic-success)" : "var(--indigo-primary)"} />
                    <h3
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        color: isResolved ? "var(--text-secondary)" : "var(--indigo-primary)",
                      }}
                    >
                      {q.question}
                    </h3>
                  </div>

                  {q.notes && (
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.3rem", paddingLeft: "1.65rem" }}>
                      {q.notes}
                    </p>
                  )}

                  <div
                    style={{
                      fontSize: "0.825rem",
                      color: "var(--text-muted)",
                      marginTop: "0.4rem",
                      paddingLeft: "1.65rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span>{q.meetingTitle || q.meetingId}</span>
                    <span>•</span>
                    <span>Raised {formatDate(q.date)}</span>
                    {q.owner && (
                      <>
                        <span>•</span>
                        <span>Assigned to {q.owner}</span>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                  <Badge variant={isResolved ? "success" : "warning"}>
                    {q.status}
                  </Badge>

                  {onToggleQuestionResolved && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={isResolved ? RotateCcw : CheckCircle2}
                      onClick={() => onToggleQuestionResolved(q.id)}
                    >
                      {isResolved ? "Reopen" : "Resolve"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
