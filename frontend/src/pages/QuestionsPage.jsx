import { useState, useMemo } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { SearchInput } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Tabs } from "../components/ui/Tabs";
import { EmptyState } from "../components/ui/EmptyState";
import { QuestionCard } from "../components/questions/QuestionCard";
import { HelpCircle } from "lucide-react";

export function QuestionsPage({
  questions = [],
  onToggleResolved,
}) {
  const [activeTab, setActiveTab] = useState("all"); // all | open | resolved
  const [searchQuery, setSearchQuery] = useState("");

  const counts = useMemo(() => {
    return {
      all: questions.length,
      open: questions.filter((q) => q.status !== "Resolved").length,
      resolved: questions.filter((q) => q.status === "Resolved").length,
    };
  }, [questions]);

  const tabs = [
    { id: "all", label: "All Questions", count: counts.all },
    { id: "open", label: "Open & In Discussion", count: counts.open },
    { id: "resolved", label: "Resolved", count: counts.resolved },
  ];

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (activeTab === "open" && q.status === "Resolved") return false;
      if (activeTab === "resolved" && q.status !== "Resolved") return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          q.question.toLowerCase().includes(query) ||
          q.owner?.toLowerCase().includes(query) ||
          q.meetingTitle?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [questions, activeTab, searchQuery]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader
        title="Unresolved Questions Registry"
        description="Cataloging critical questions and technical ambiguities raised during meetings that need investigation."
        breadcrumbs={["Institutional Memory", "Open Questions"]}
        badge={<Badge variant="warning">{counts.open} Open Inquiries</Badge>}
      />

      {/* Controls */}
      <div
        className="glass-card"
        style={{
          padding: "1rem 1.25rem",
          backgroundColor: "#FFFFFF",
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
            placeholder="Search questions by topic or owner..."
          />
        </div>
      </div>

      {/* Question Cards List */}
      {filteredQuestions.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onToggleResolved={onToggleResolved}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={HelpCircle}
          title="No questions found"
          description="There are no unresolved questions matching your search."
        />
      )}
    </div>
  );
}
