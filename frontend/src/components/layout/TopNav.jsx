import { Search, Upload, Menu } from "lucide-react";
import { Button } from "../ui/Button";

export function TopNav({
  onOpenSearch,
  onOpenUpload,
  onToggleMobileMenu,
  backendStatus = "checking", // connected | disconnected | checking
  activePageTitle = "Overview",
}) {
  return (
    <header
      className="glass-panel"
      style={{
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        backgroundColor: "rgba(255, 255, 255, 0.82)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {/* Left: Mobile trigger & Current Context */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={onToggleMobileMenu}
          aria-label="Toggle Navigation Menu"
          style={{
            display: "none",
            padding: "0.45rem",
            borderRadius: "var(--radius-sm)",
            color: "var(--indigo-primary)",
          }}
          className="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>

        <div style={{ fontSize: "0.95rem", fontWeight: 550, color: "var(--text-secondary)" }}>
          EchoVault <span style={{ color: "var(--text-muted)", margin: "0 0.35rem" }}>/</span>{" "}
          <span style={{ color: "var(--indigo-primary)", fontWeight: 600 }}>{activePageTitle}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Global Search Bar (Ctrl+K) */}
        <button
          onClick={onOpenSearch}
          aria-label="Search records"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.5rem 0.85rem",
            borderRadius: "var(--radius-md)",
            backgroundColor: "#FFFFFF",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
            minWidth: "240px",
            justifyContent: "space-between",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-periwinkle)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Search size={15} color="var(--indigo-primary)" />
            <span>Search decisions & meetings...</span>
          </div>
          <kbd
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              backgroundColor: "var(--surface-alt)",
              padding: "0.15rem 0.4rem",
              borderRadius: "4px",
              color: "var(--indigo-primary)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Backend Connection Indicator */}
        <div
          title={`Backend API Status: ${backendStatus}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
            padding: "0.3rem 0.6rem",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor:
                backendStatus === "connected"
                  ? "var(--semantic-success)"
                  : "var(--accent-periwinkle)",
            }}
          />
          <span style={{ fontSize: "0.8rem" }}>
            {backendStatus === "connected" ? "Live" : "Standby"}
          </span>
        </div>

        {/* Primary Action Button */}
        <Button
          variant="primary"
          size="sm"
          icon={Upload}
          onClick={onOpenUpload}
        >
          Upload meeting
        </Button>
      </div>
    </header>
  );
}
