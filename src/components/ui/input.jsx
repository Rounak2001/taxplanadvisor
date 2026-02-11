import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, onFocus, ...props }, ref) => {
  const handleFocus = (e) => {
    // Prevent auto-selection when clicking on input
    const selectionAllowed = ["text", "search", "url", "tel", "password"].includes(type || "text");
    if (e.target.value && selectionAllowed) {
      const length = e.target.value.length;
      e.target.setSelectionRange(length, length);
    }
    // Call custom onFocus if provided
    if (onFocus) {
      onFocus(e);
    }
  };

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      onFocus={handleFocus}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
