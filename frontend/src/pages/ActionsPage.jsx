import { useState, useMemo } from "react";
import { SearchInput } from "../components/ui/Input";
import { Tabs } from "../components/ui/Tabs";
import { EmptyState } from "../components/ui/EmptyState";
import { ActionItemRow } from "../components/actions/ActionItemRow";
import { CheckSquare } from "lucide-react";

export function ActionsPage({
  actions = [],
  onToggleStatus,
}) {
  const [activeTab, setActiveTab] = useState("all"); // all | pending | completed
  const [searchQuery, setSearchQuery] = useState("");

  const counts = useMemo(() => {
    return {
      all: actions.length,
      pending: actions.filter((a) => a.status !== "Completed").length,
      completed: actions.filter((a) => a.status === "Completed").length,
    };
  }, [actions]);

  const tabs = [
    { id: "all", label: "All tasks", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "completed", label: "Completed", count: counts.completed },
  ];

  const filteredActions = useMemo(() => {
    return actions.filter((action) => {
      if (activeTab === "pending" && action.status === "Completed") return false;
      if (activeTab === "completed" && action.status !== "Completed") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          action.task.toLowerCase().includes(q) ||
          action.owner?.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [actions, activeTab, searchQuery]);

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
            Action Items
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              marginTop: "0.35rem",
            }}
          >
            Ownership and responsibilities committed in institutional meetings.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div style={{ minWidth: "260px" }}>
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks or owners..."
          />
        </div>
      </div>

      {/* Tasks List */}
      {filteredActions.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {filteredActions.map((action) => (
            <ActionItemRow
              key={action.id}
              action={action}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description={
            activeTab === "completed"
              ? "No completed tasks in this view."
              : "No pending tasks match your search."
          }
        />
      )}
    </div>
  );
}
