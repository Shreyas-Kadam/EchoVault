import { cn } from "../../lib/utils";

export function Badge({
  variant = "indigo", // indigo | periwinkle | violet | success | warning | error | info
  children,
  className,
  icon: Icon,
  ...props
}) {
  const variantClass = {
    indigo: "badge-indigo",
    periwinkle: "badge-periwinkle",
    violet: "badge-violet",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    info: "badge-info",
  }[variant] || "badge-indigo";

  return (
    <span className={cn("badge", variantClass, className)} {...props}>
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
