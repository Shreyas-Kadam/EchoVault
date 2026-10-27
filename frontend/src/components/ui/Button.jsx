import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Button = forwardRef(
  (
    {
      className,
      variant = "primary", // primary | secondary | outline | ghost | accent | destructive
      size = "md",        // sm | md | lg | icon
      children,
      disabled = false,
      loading = false,
      icon: Icon,
      ...props
    },
    ref
  ) => {
    const variantClass = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      outline: "btn-outline",
      ghost: "btn-ghost",
      accent: "btn-accent",
      destructive: "badge-error hover:opacity-90",
    }[variant] || "btn-primary";

    const sizeClass = {
      sm: "btn-sm",
      md: "",
      lg: "btn-lg",
      icon: "btn-icon",
    }[size] || "";

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn("btn", variantClass, sizeClass, className)}
        {...props}
      >
        {loading ? (
          <span
            style={{
              width: "1rem",
              height: "1rem",
              border: "2px solid currentColor",
              borderRightColor: "transparent",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.6s linear infinite",
            }}
          />
        ) : (
          Icon && <Icon size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
