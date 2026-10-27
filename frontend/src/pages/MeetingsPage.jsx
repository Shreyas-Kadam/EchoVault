import { useState, useMemo } from "react";
import { SearchInput } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import {
  CalendarDays,
  Upload,
} from "lucide-react";
import { formatDate } from "../lib/utils";

export function MeetingsPage({
  meetings = [],
  onSelectMeeting,
  onOpenUpload,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMeetings = useMemo(() => {
    if (!searchQuery.trim()) return meetings;
    const q = searchQuery.toLowerCase().trim();
    return meetings.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q)
    );
  }, [meetings, searchQuery]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
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
            Meetings
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              marginTop: "0.35rem",
            }}
          >
            Synced sessions, discussion transcripts, and extracted organizational memory.
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

      {/* Search Bar */}
      <div style={{ maxWidth: "480px" }}>
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search meetings by title or discussion topic..."
        />
      </div>

      {/* Clean Meeting List */}
      {filteredMeetings.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => onSelectMeeting(meeting)}
              className="glass-card glass-card-hover"
              style={{
                padding: "1.4rem 1.6rem",
                backgroundColor: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1.5rem",
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "var(--indigo-primary)",
                      lineHeight: 1.35,
                    }}
                  >
                    {meeting.title}
                  </h3>
                  {meeting.duration && (
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      ({meeting.duration})
                    </span>
                  )}
                </div>

                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.4rem",
                    lineHeight: 1.55,
                  }}
                >
                  {meeting.summary}
                </p>

                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    marginTop: "0.6rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>{formatDate(meeting.date)}</span>
                  <span>•</span>
                  <span style={{ color: "var(--indigo-primary)", fontWeight: 550 }}>
                    {meeting.decisionsCount || 0} {meeting.decisionsCount === 1 ? "decision" : "decisions"} extracted
                  </span>
                  {meeting.attendees?.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{meeting.attendees.length} attendees</span>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0, marginTop: "0.2rem" }}>
                <Badge variant={meeting.status === "Processed" ? "success" : "warning"}>
                  {meeting.status}
                </Badge>
                <span style={{ color: "var(--text-muted)", fontSize: "1rem" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="No meetings found"
          description="Try adjusting your search criteria or upload a new recording."
          actionLabel="Upload meeting"
          onAction={onOpenUpload}
        />
      )}
    </div>
  );
}
