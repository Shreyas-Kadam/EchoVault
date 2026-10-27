import { useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { ToastContext } from "../../hooks/useToast";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = "info", duration = 4000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (title, message) => addToast({ title, message, type: "success" }),
    error: (title, message) => addToast({ title, message, type: "error" }),
    warning: (title, message) => addToast({ title, message, type: "warning" }),
    info: (title, message) => addToast({ title, message, type: "info" }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          maxWidth: "380px",
          width: "100%",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="glass-floating animate-fade-in"
            style={{
              pointerEvents: "auto",
              padding: "0.85rem 1rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: "#FFFFFF",
              border: `1px solid ${
                t.type === "success"
                  ? "var(--semantic-success-border)"
                  : t.type === "error"
                  ? "var(--semantic-error-border)"
                  : t.type === "warning"
                  ? "var(--semantic-warning-border)"
                  : "var(--border-glass)"
              }`,
              boxShadow: "var(--glass-shadow-floating)",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            <div style={{ flexShrink: 0, marginTop: "0.1rem" }}>
              {t.type === "success" && <CheckCircle2 size={18} color="var(--semantic-success)" />}
              {t.type === "error" && <AlertCircle size={18} color="var(--semantic-error)" />}
              {t.type === "warning" && <AlertTriangle size={18} color="var(--semantic-warning)" />}
              {t.type === "info" && <Info size={18} color="var(--semantic-info)" />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--indigo-primary)" }}>
                {t.title}
              </div>
              {t.message && (
                <div style={{ fontSize: "0.775rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                  {t.message}
                </div>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              style={{
                color: "var(--text-muted)",
                padding: "0.2rem",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
