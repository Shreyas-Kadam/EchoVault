import { cn } from "../../lib/utils";

export function Skeleton({ className, width, height, borderRadius, style, ...props }) {
  return (
    <div
      className={cn("animate-pulse-subtle", className)}
      style={{
        width: width || "100%",
        height: height || "1rem",
        borderRadius: borderRadius || "var(--radius-sm)",
        backgroundColor: "var(--section-subtle)",
        backgroundImage: "linear-gradient(90deg, rgba(220, 214, 247, 0.4) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(220, 214, 247, 0.4) 100%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
      {...props}
    />
  );
}
