import { useState, useMemo } from "react";
import { SearchInput } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { exportToCSV, formatDate } from "../lib/utils";
import { Download, X, FileCheck2, Sparkles } from "lucide-react";

export function DecisionsPage({
  decisions = [],
  onSelectDecision,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredDecisions = useMemo(() => {
    let result = [...decisions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.title?.toLowerCase().includes(q) ||
          d.statement?.toLowerCase().includes(q) ||
          d.context?.toLowerCase().includes(q) ||
          d.meetingTitle?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((d) => d.status === statusFilter);
    }

    return result;
  }, [decisions, searchQuery, statusFilter]);

  const handleExportCSV = () => {
    const exportData = filteredDecisions.map((d) => ({
      Title: d.title,
      Status: d.status,
      Meeting: d.meetingTitle,
      Date: d.date,
      Statement: d.statement,
      Context: d.context,
    }));
    exportToCSV(exportData, `echovault-decisions-${new Date().toISOString().split("T")[0]}.csv`);
  };

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "ALL";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
  };

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
            Decisions
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-secondary)",
              marginTop: "0.35rem",
            }}
          >
            Searchable institutional memory and evidence-backed team commitments.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={handleExportCSV}
          disabled={filteredDecisions.length === 0}
        >
          Export CSV
        </Button>
      </div>

      {/* Search and Compact Filter */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "280px" }}>
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decisions by title, statement, or meeting..."
          />
        </div>

        <div style={{ minWidth: "160px" }}>
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ cursor: "pointer" }}
          >
            <option value="ALL">All statuses</option>
            <option value="Approved">Approved</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Superseded">Superseded</option>
          </select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={clearFilters}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Clean Decision List (No dense table columns) */}
      {filteredDecisions.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {filteredDecisions.map((decision) => (
            <div
              key={decision.id}
              onClick={() => onSelectDecision(decision)}
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      color: "var(--indigo-primary)",
                      lineHeight: 1.35,
                    }}
                  >
                    {decision.title}
                  </h3>
                  {decision.isAiExtracted && !decision.verifiedByHuman && (
                    <span title="Provisional AI extraction (Awaiting human sign-off)">
                      <Sparkles size={14} color="var(--accent-periwinkle)" />
                    </span>
                  )}
                </div>

                {decision.context && (
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--text-secondary)",
                      marginTop: "0.4rem",
                      lineHeight: 1.55,
                    }}
                  >
                    {decision.context}
                  </p>
                )}

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

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0, marginTop: "0.2rem" }}>
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
                <span style={{ color: "var(--text-muted)", fontSize: "1rem" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileCheck2}
          title="No decisions found"
          description="Try relaxing your search query or resetting the status filter."
          actionLabel="Clear filter"
          onAction={clearFilters}
        />
      )}
    </div>
  );
}
