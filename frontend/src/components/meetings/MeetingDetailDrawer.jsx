import { useState } from "react";
import { Drawer } from "../ui/Drawer";
import { Badge } from "../ui/Badge";
import { Tabs } from "../ui/Tabs";
import { AudioTimeline } from "./AudioTimeline";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  FileCheck2,
} from "lucide-react";
import { formatDate } from "../../lib/utils";

export function MeetingDetailDrawer({
  meeting,
  isOpen,
  onClose,
  onSelectDecision,
}) {
  const [activeTab, setActiveTab] = useState("transcript");
  const [selectedSeekTime, setSelectedSeekTime] = useState(null);

  const handleJumpToTimestamp = (timeString) => {
    if (!timeString) return;
    const parts = timeString.split(":").map(Number);
    let seconds = 0;
    if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    }
    setSelectedSeekTime(seconds);
    setActiveTab("timeline");
  };

  if (!meeting) return null;

  const tabs = [
    { id: "transcript", label: "Transcript", icon: FileText },
    { id: "timeline", label: "Audio & Timeline", icon: Clock },
    { id: "summary", label: "Summary & Attendees", icon: Users },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={meeting.title}
      subtitle={`Meeting ID: ${meeting.id} • Recorded on ${formatDate(meeting.date)} • ${meeting.duration}`}
      width="700px"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Quick Stats Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <Badge variant="indigo" icon={Calendar}>
            {formatDate(meeting.date)}
          </Badge>
          <Badge variant="periwinkle" icon={Clock}>
            {meeting.duration}
          </Badge>
          <Badge variant="violet" icon={Users}>
            {meeting.attendees?.length || 0} Attendees
          </Badge>
          <Badge variant="success" icon={FileCheck2}>
            {meeting.decisionsCount || 0} Decisions
          </Badge>
        </div>

        {/* Tab selection */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab 1: Transcript */}
        {activeTab === "transcript" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>Chronological Transcript Excerpts</span>
              <span style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
                Click timestamp to seek in audio
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              {meeting.transcript && meeting.transcript.length > 0 ? (
                meeting.transcript.map((line, idx) => {
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: "0.85rem 1rem",
                        backgroundColor: "var(--surface-alt)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.3rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.825rem", color: "var(--indigo-primary)" }}>
                          {line.speaker}
                        </span>
                        <button
                          onClick={() => handleJumpToTimestamp(line.time)}
                          title="Seek audio to this timestamp"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.725rem",
                            color: "var(--indigo-primary)",
                            backgroundColor: "#FFFFFF",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--border-subtle)",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          {line.time}
                        </button>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.55 }}>
                        {line.text}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                  No transcript entries recorded yet for this session.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Audio Timeline */}
        {activeTab === "timeline" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <AudioTimeline
              meeting={meeting}
              selectedMarkerTime={selectedSeekTime}
              onSeekDecision={(marker) => {
                if (marker.decisionId && onSelectDecision) {
                  onSelectDecision({ id: marker.decisionId, title: marker.label });
                }
              }}
            />
          </div>
        )}

        {/* Tab 3: Summary & Attendees */}
        {activeTab === "summary" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--indigo-primary)", marginBottom: "0.4rem" }}>
                Executive Meeting Summary
              </h4>
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "var(--surface-alt)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                  lineHeight: 1.6,
                }}
              >
                {meeting.summary}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--indigo-primary)", marginBottom: "0.4rem" }}>
                Session Attendees
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {meeting.attendees?.map((att, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.4rem 0.75rem",
                      borderRadius: "var(--radius-pill)",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid var(--border-subtle)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "var(--accent-periwinkle)",
                      }}
                    />
                    {att}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
