import { Button } from "./Button";

export function EmptyState({
  icon: Icon,
  title = "No records found",
  description = "There are no entries matching your current filters or search query.",
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={className}
      style={{
        padding: "3.5rem 2rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderRadius: "var(--radius-lg)",
        border: "1px dashed var(--border-subtle)",
        margin: "1rem 0",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "var(--section-subtle)",
          color: "var(--indigo-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        {Icon ? <Icon size={24} /> : null}
      </div>
      <h4
        style={{
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "var(--indigo-primary)",
          marginBottom: "0.35rem",
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--text-secondary)",
          maxWidth: "380px",
          lineHeight: 1.5,
          marginBottom: actionLabel ? "1.25rem" : 0,
        }}
      >
        {description}
      </p>
      {actionLabel && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
