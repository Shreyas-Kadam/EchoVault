import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = "560px",
  className,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "rgba(66, 72, 116, 0.3)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn("animate-slide-in-right", className)}
        style={{
          width: "100%",
          maxWidth: width,
          height: "100%",
          backgroundColor: "#FFFFFF",
          borderLeft: "1px solid var(--border-glass)",
          boxShadow: "-8px 0 32px rgba(66, 72, 116, 0.14)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            background: "var(--surface-alt)",
          }}
        >
          <div>
            {title && (
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--indigo-primary)",
                  margin: 0,
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  margin: "0.25rem 0 0",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            style={{
              padding: "0.4rem",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-muted)",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
              e.currentTarget.style.color = "var(--indigo-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            padding: "1.5rem",
            overflowY: "auto",
            flex: 1,
            background: "var(--surface-white)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
