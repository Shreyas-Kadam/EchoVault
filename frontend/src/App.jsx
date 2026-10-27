import { useState, useEffect } from "react";
import { AppShell } from "./components/layout/AppShell";
import { ToastProvider } from "./components/ui/Toast";
import { useToast } from "./hooks/useToast";
import { OverviewPage } from "./pages/OverviewPage";
import { DecisionsPage } from "./pages/DecisionsPage";
import { MeetingsPage } from "./pages/MeetingsPage";
import { ActionsPage } from "./pages/ActionsPage";
import { ConflictsPage } from "./pages/ConflictsPage";
import { DecisionDetailDrawer } from "./components/decisions/DecisionDetailDrawer";
import { MeetingDetailDrawer } from "./components/meetings/MeetingDetailDrawer";
import { MeetingUploadModal } from "./components/meetings/MeetingUploadModal";
import { checkBackendHealth } from "./services/api";
import {
  INITIAL_DECISIONS,
  INITIAL_MEETINGS,
  INITIAL_ACTION_ITEMS,
  INITIAL_QUESTIONS,
  INITIAL_CONFLICTS,
} from "./data/demoData";

function AppContent() {
  const toast = useToast();

  // Primary State
  const [activePage, setActivePage] = useState("overview");
  const [decisions, setDecisions] = useState(INITIAL_DECISIONS);
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [actions, setActions] = useState(INITIAL_ACTION_ITEMS);
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [conflicts, setConflicts] = useState(INITIAL_CONFLICTS);

  // Modals & Drawers
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Backend Health
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    async function verifyBackend() {
      const res = await checkBackendHealth();
      if (res.success) {
        setBackendStatus(res.database === "connected" ? "connected" : "standby");
      } else {
        setBackendStatus("offline");
      }
    }
    verifyBackend();
    const interval = setInterval(verifyBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleToggleActionStatus = (actionId) => {
    setActions((prev) =>
      prev.map((a) => {
        if (a.id === actionId) {
          const nextStatus = a.status === "Completed" ? "Pending" : "Completed";
          if (nextStatus === "Completed") {
            toast.success("Action Item Completed", `"${a.task}" marked complete.`);
          } else {
            toast.info("Task Reopened", `"${a.task}" set to pending.`);
          }
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const handleToggleQuestionResolved = (questionId) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const nextStatus = q.status === "Resolved" ? "In Discussion" : "Resolved";
          if (nextStatus === "Resolved") {
            toast.success("Question Resolved", `Question ${q.id} marked as resolved.`);
          } else {
            toast.info("Question Reopened", `Question ${q.id} reopened for investigation.`);
          }
          return { ...q, status: nextStatus };
        }
        return q;
      })
    );
  };

  const handleResolveConflict = (conflictId) => {
    setConflicts((prev) =>
      prev.map((c) =>
        c.id === conflictId ? { ...c, status: "Resolved" } : c
      )
    );
    toast.success("Conflict Resolved", "Updated institutional memory record confirmed by human lead.");
  };

  const handleDismissConflict = (conflictId) => {
    setConflicts((prev) =>
      prev.map((c) =>
        c.id === conflictId ? { ...c, status: "Dismissed" } : c
      )
    );
    toast.info("Conflict Dismissed", "Marked as non-contradictory after contextual review.");
  };

  const handleUploadSuccess = (newMeeting) => {
    setMeetings((prev) => [newMeeting, ...prev]);
    const stagedDecision = {
      id: `DEC-2026-${Math.floor(100 + Math.random() * 899)}`,
      title: `Adopt Process Framework for ${newMeeting.title}`,
      statement: `Establish operational guidelines and tracking criteria documented in ${newMeeting.title}.`,
      status: "Pending Review",
      category: "Operations",
      owner: newMeeting.attendees?.[0] || "Ingestion System",
      ownerRole: "Contributor",
      date: newMeeting.date,
      meetingId: newMeeting.id,
      meetingTitle: newMeeting.title,
      timestamp: "00:00:15",
      context: `Automatically extracted provisional draft commitment from session ${newMeeting.title}.`,
      evidence: `Session summary: ${newMeeting.summary}`,
      relatedDecisions: [],
      actionItems: [],
      openQuestions: [],
      isAiExtracted: true,
      verifiedByHuman: false,
      impact: "Medium",
    };
    setDecisions((prev) => [stagedDecision, ...prev]);
    toast.success("Meeting Ingested", `"${newMeeting.title}" added with extracted candidate decision.`);
    setSelectedMeeting(newMeeting);
  };

  const handleSelectSearchResult = (result) => {
    if (result.type === "decision") {
      setSelectedDecision(result.item);
    } else if (result.type === "meeting") {
      setSelectedMeeting(result.item);
    } else if (result.type === "action") {
      setActivePage("actions");
    } else if (result.type === "question") {
      setActivePage("conflicts");
    }
  };

  const handleOpenMeetingFromDecision = (meetingId) => {
    const found = meetings.find((m) => m.id === meetingId);
    if (found) {
      setSelectedDecision(null);
      setSelectedMeeting(found);
    }
  };

  // Badges & Counts
  const counts = {
    decisions: decisions.length,
    meetings: meetings.length,
    actions: actions.filter((a) => a.status !== "Completed").length,
    questions: questions.filter((q) => q.status !== "Resolved").length,
    conflicts: conflicts.filter((c) => c.status !== "Dismissed" && c.status !== "Resolved").length,
  };

  const searchData = {
    decisions,
    meetings,
    actions,
    questions,
    conflicts,
  };

  return (
    <AppShell
      activePage={activePage}
      onNavigate={setActivePage}
      onOpenUpload={() => setIsUploadOpen(true)}
      backendStatus={backendStatus}
      counts={counts}
      searchData={searchData}
      onSelectSearchResult={handleSelectSearchResult}
    >
      {activePage === "overview" && (
        <OverviewPage
          decisions={decisions}
          meetings={meetings}
          actions={actions}
          questions={questions}
          conflicts={conflicts}
          onNavigate={setActivePage}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenSearch={() => {
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
            );
          }}
          onSelectDecision={setSelectedDecision}
          onSelectMeeting={setSelectedMeeting}
          onToggleActionStatus={handleToggleActionStatus}
          onResolveConflict={handleResolveConflict}
          onDismissConflict={handleDismissConflict}
        />
      )}

      {activePage === "decisions" && (
        <DecisionsPage
          decisions={decisions}
          onSelectDecision={setSelectedDecision}
          onNewDecision={() => setIsUploadOpen(true)}
        />
      )}

      {activePage === "meetings" && (
        <MeetingsPage
          meetings={meetings}
          onSelectMeeting={setSelectedMeeting}
          onOpenUpload={() => setIsUploadOpen(true)}
        />
      )}

      {activePage === "actions" && (
        <ActionsPage
          actions={actions}
          onToggleStatus={handleToggleActionStatus}
          onNewAction={() => {}}
        />
      )}

      {(activePage === "conflicts" || activePage === "questions") && (
        <ConflictsPage
          conflicts={conflicts}
          questions={questions}
          onResolveConflict={handleResolveConflict}
          onDismissConflict={handleDismissConflict}
          onToggleQuestionResolved={handleToggleQuestionResolved}
          onSelectMeetingById={handleOpenMeetingFromDecision}
        />
      )}

      {/* Decision Detail Drawer */}
      <DecisionDetailDrawer
        decision={selectedDecision}
        isOpen={Boolean(selectedDecision)}
        onClose={() => setSelectedDecision(null)}
        onViewMeeting={handleOpenMeetingFromDecision}
      />

      {/* Meeting Detail Drawer */}
      <MeetingDetailDrawer
        meeting={selectedMeeting}
        isOpen={Boolean(selectedMeeting)}
        onClose={() => setSelectedMeeting(null)}
        onSelectDecision={(d) => {
          const dec = decisions.find((item) => item.id === d.id);
          if (dec) {
            setSelectedMeeting(null);
            setSelectedDecision(dec);
          }
        }}
      />

      {/* Upload Modal */}
      <MeetingUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </AppShell>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
