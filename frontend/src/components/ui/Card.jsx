import { cn } from "../../lib/utils";

export function Card({ className, children, hoverable = false, ...props }) {
  return (
    <div
      className={cn(
        "glass-card",
        hoverable && "glass-card-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn("p-5 border-b border-[var(--border-subtle)] flex items-center justify-between", className)}
      style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("text-base font-semibold text-[var(--indigo-primary)]", className)}
      style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--indigo-primary)" }}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={cn("text-xs text-[var(--text-secondary)] mt-0.5", className)}
      style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div
      className={cn("p-5", className)}
      style={{ padding: "1.25rem 1.5rem" }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn("p-4 border-t border-[var(--border-subtle)] bg-[var(--surface-alt)] rounded-b-[var(--radius-lg)]", className)}
      style={{
        padding: "0.85rem 1.5rem",
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--surface-alt)",
        borderBottomLeftRadius: "var(--radius-lg)",
        borderBottomRightRadius: "var(--radius-lg)",
      }}
      {...props}
    >
      {children}
    </div>
  );
}
