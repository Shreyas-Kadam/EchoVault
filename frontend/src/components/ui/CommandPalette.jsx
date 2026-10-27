import { useState, useEffect, useRef, useMemo } from "react";
import { Search, FileText, CheckSquare, HelpCircle, CornerDownLeft } from "lucide-react";
import { Badge } from "./Badge";

export function CommandPalette({
  isOpen,
  onClose,
  data = { decisions: [], meetings: [], actions: [], questions: [], conflicts: [] },
  onSelectResult,
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Compute search matches across datasets
  const lowerQuery = query.toLowerCase().trim();

  const filteredDecisions = (data.decisions || []).filter(
    (d) =>
      !lowerQuery ||
      d.title?.toLowerCase().includes(lowerQuery) ||
      d.id?.toLowerCase().includes(lowerQuery) ||
      d.context?.toLowerCase().includes(lowerQuery) ||
      d.owner?.toLowerCase().includes(lowerQuery)
  );

  const filteredMeetings = (data.meetings || []).filter(
    (m) =>
      !lowerQuery ||
      m.title?.toLowerCase().includes(lowerQuery) ||
      m.id?.toLowerCase().includes(lowerQuery) ||
      m.summary?.toLowerCase().includes(lowerQuery)
  );

  const filteredActions = (data.actions || []).filter(
    (a) =>
      !lowerQuery ||
      a.task?.toLowerCase().includes(lowerQuery) ||
      a.owner?.toLowerCase().includes(lowerQuery)
  );

  const filteredQuestions = (data.questions || []).filter(
    (q) =>
      !lowerQuery ||
      q.question?.toLowerCase().includes(lowerQuery) ||
      q.owner?.toLowerCase().includes(lowerQuery)
  );

  // Flattened results for keyboard navigation wrapped in useMemo
  const flatResults = useMemo(() => {
    return [
      ...filteredDecisions.slice(0, 5).map((item) => ({ type: "decision", item, title: item.title, subtitle: `ID: ${item.id} • ${item.meetingTitle || item.meetingId}` })),
      ...filteredMeetings.slice(0, 4).map((item) => ({ type: "meeting", item, title: item.title, subtitle: `${item.date} • ${item.duration || ""}` })),
      ...filteredActions.slice(0, 3).map((item) => ({ type: "action", item, title: item.task, subtitle: `Owner: ${item.owner} • Due: ${item.dueDate}` })),
      ...filteredQuestions.slice(0, 3).map((item) => ({ type: "question", item, title: item.question, subtitle: `Raised in: ${item.meetingTitle || item.meetingId}` })),
    ];
  }, [filteredDecisions, filteredMeetings, filteredActions, filteredQuestions]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < flatResults.length ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatResults.length - 1));
      } else if (e.key === "Enter" && flatResults[selectedIndex]) {
        e.preventDefault();
        onSelectResult(flatResults[selectedIndex]);
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, flatResults, selectedIndex, onClose, onSelectResult]);

  if (!isOpen) return null;

  const renderIcon = (type) => {
    switch (type) {
      case "decision":
        return <FileText size={16} color="var(--indigo-primary)" />;
      case "meeting":
        return <FileText size={16} color="var(--semantic-info)" />;
      case "action":
        return <CheckSquare size={16} color="var(--semantic-success)" />;
      case "question":
        return <HelpCircle size={16} color="var(--semantic-warning)" />;
      default:
        return <Search size={16} />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10001,
        backgroundColor: "rgba(66, 72, 116, 0.4)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
        paddingInline: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-floating animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "620px",
          backgroundColor: "#FFFFFF",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-glass)",
          boxShadow: "var(--glass-shadow-floating)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid var(--border-subtle)",
            gap: "0.75rem",
          }}
        >
          <Search size={18} style={{ color: "var(--indigo-primary)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search decisions, meetings, actions..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "0.95rem",
              color: "var(--text-primary)",
              background: "transparent",
            }}
          />
          <kbd
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              padding: "0.2rem 0.45rem",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--section-subtle)",
              color: "var(--text-muted)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div
          style={{
            maxHeight: "380px",
            overflowY: "auto",
            padding: "0.5rem",
          }}
        >
          {flatResults.length === 0 ? (
            <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "var(--text-secondary)" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>No results found for "{query}"</p>
              <p style={{ fontSize: "0.775rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Try searching by decision name, ID, meeting title, or owner.
              </p>
            </div>
          ) : (
            flatResults.map((result, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${result.type}-${idx}`}
                  onClick={() => {
                    onSelectResult(result);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.65rem 0.9rem",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "var(--section-subtle)" : "transparent",
                    border: isSelected ? "1px solid var(--border-subtle)" : "1px solid transparent",
                    transition: "all 0.12s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                    <div
                      style={{
                        padding: "0.4rem",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: isSelected ? "#FFFFFF" : "var(--surface-alt)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {renderIcon(result.type)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {result.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {result.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Badge variant={result.type === "decision" ? "indigo" : result.type === "action" ? "success" : "violet"}>
                      {result.type}
                    </Badge>
                    {isSelected && <CornerDownLeft size={14} color="var(--indigo-primary)" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div
          style={{
            padding: "0.65rem 1.25rem",
            borderTop: "1px solid var(--border-subtle)",
            backgroundColor: "var(--surface-alt)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span>Navigate: ↑ / ↓</span>
            <span>Select: ↵</span>
            <span>Close: Esc</span>
          </div>
          <span>EchoVault Command Palette</span>
        </div>
      </div>
    </div>
  );
}
