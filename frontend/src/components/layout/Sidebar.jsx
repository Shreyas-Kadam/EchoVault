import {
  LayoutDashboard,
  FileCheck2,
  CalendarDays,
  CheckSquare,
  AlertTriangle,
  Layers,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "decisions", label: "Decisions", icon: FileCheck2 },
  { id: "meetings", label: "Meetings", icon: CalendarDays },
  { id: "actions", label: "Action Items", icon: CheckSquare },
  { id: "conflicts", label: "Conflicts", icon: AlertTriangle, hasAlert: true },
];

export function Sidebar({
  activePage,
  onNavigate,
  isMobileOpen = false,
  onCloseMobile,
  counts = {},
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(66, 72, 116, 0.25)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 990,
          }}
        />
      )}

      <aside
        className="glass-panel"
        style={{
          width: "250px",
          height: "100vh",
          position: "sticky",
          top: 0,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgba(255, 255, 255, 0.88)",
          borderRight: "1px solid var(--border-subtle)",
          zIndex: 995,
          transition: "transform 0.22s ease",
          ...(isMobileOpen
            ? {
                position: "fixed",
                transform: "translateX(0)",
              }
            : {}),
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: "1.75rem 1.4rem 1.4rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              backgroundColor: "var(--indigo-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              flexShrink: 0,
            }}
          >
            <Layers size={18} strokeWidth={2.4} />
          </div>

          <div>
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: 650,
                color: "var(--indigo-primary)",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
              }}
            >
              EchoVault
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                letterSpacing: "0.01em",
                marginTop: "0.15rem",
              }}
            >
              Decision Intelligence
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav
          style={{
            flex: 1,
            padding: "1rem 0.85rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
            overflowY: "auto",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            const Icon = item.icon;
            const count = counts[item.id];

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.975rem", /* ~15.5px SF Pro */
                  fontWeight: isActive ? 600 : 450,
                  transition: "all 0.15s ease",
                  backgroundColor: isActive ? "var(--bg-secondary)" : "transparent",
                  color: isActive ? "var(--indigo-primary)" : "var(--text-secondary)",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "rgba(220, 214, 247, 0.35)";
                    e.currentTarget.style.color = "var(--indigo-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.4 : 1.9}
                    color={isActive ? "var(--indigo-primary)" : "var(--text-secondary)"}
                  />
                  <span>{item.label}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  {item.hasAlert && counts.conflicts > 0 && (
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "var(--semantic-warning)",
                      }}
                    />
                  )}
                  {count != null && count > 0 && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.1rem 0.45rem",
                        borderRadius: "9999px",
                        backgroundColor: isActive ? "#FFFFFF" : "rgba(220, 214, 247, 0.5)",
                        color: "var(--indigo-primary)",
                      }}
                    >
                      {count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section: Workspace & User Profile */}
        <div
          style={{
            padding: "1rem 1.15rem 1.25rem",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {/* User profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "var(--indigo-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "0.8rem",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              SK
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Shreyas Kadam
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                Product Workspace
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
