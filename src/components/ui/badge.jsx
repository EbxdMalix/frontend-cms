import * as React from "react";
import { cn } from "../../lib/utils";

const variantStyles = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "border border-border bg-background hover:bg-muted hover:text-foreground",
  ghost: "hover:bg-muted hover:text-foreground",
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};

const sizeStyles = {
  default: "px-3 py-1 text-xs font-medium",
  sm: "px-2 py-0.5 text-[10px] font-medium",
  lg: "px-4 py-1.5 text-sm font-semibold",
  icon: "h-6 w-6 p-0",
};

const base = "inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer select-none whitespace-nowrap";

const Badge = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          base,
          variantStyles[variant] ?? variantStyles.default,
          sizeStyles[size] ?? sizeStyles.default,
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };