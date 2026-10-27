import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Search } from "lucide-react";

export const Input = forwardRef(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn("input-field", className)}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const SearchInput = forwardRef(
  ({ className, placeholder = "Search decisions, meetings, tags...", ...props }, ref) => {
    return (
      <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
        <Search
          size={16}
          style={{
            position: "absolute",
            left: "0.85rem",
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        />
        <input
          type="search"
          ref={ref}
          placeholder={placeholder}
          className={cn("input-field", className)}
          style={{
            paddingLeft: "2.4rem",
            width: "100%",
          }}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";
