import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { CommandPalette } from "../ui/CommandPalette";

export function AppShell({
  activePage,
  onNavigate,
  onOpenUpload,
  backendStatus,
  counts,
  searchData,
  onSelectSearchResult,
  children,
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global Ctrl+K / Cmd+K handler
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const titles = {
    overview: "Overview",
    decisions: "Decisions",
    meetings: "Meetings",
    actions: "Action Items",
    conflicts: "Conflicts",
  };
  const activePageTitle = titles[activePage] || "Overview";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--bg-canvas)",
        width: "100%",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        counts={counts}
      />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          minHeight: "100vh",
        }}
      >
        {/* Top Navigation */}
        <TopNav
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenUpload={onOpenUpload}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          backendStatus={backendStatus}
          activePageTitle={activePageTitle}
        />

        {/* Page Content Container */}
        <main
          style={{
            flex: 1,
            padding: "2.5rem 3rem 4rem",
            maxWidth: "1280px",
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        data={searchData}
        onSelectResult={(result) => {
          if (onSelectSearchResult) {
            onSelectSearchResult(result);
          }
        }}
      />
    </div>
  );
}
