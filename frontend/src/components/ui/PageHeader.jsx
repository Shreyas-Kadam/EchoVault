export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  badge,
}) {
  return (
    <div
      style={{
        marginBottom: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {/* Breadcrumb Context */}
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.775rem", color: "var(--text-muted)" }}>
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              {idx > 0 && <span>/</span>}
              <span style={{ color: idx === breadcrumbs.length - 1 ? "var(--indigo-primary)" : "var(--text-secondary)", fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400 }}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      )}

      {/* Title & Actions Row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <h1
              style={{
                fontSize: "1.65rem",
                fontWeight: 800,
                color: "var(--indigo-primary)",
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                marginTop: "0.3rem",
                maxWidth: "680px",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
