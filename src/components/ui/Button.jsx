
import { forwardRef } from "react";
import { cn } from "../../lib/utils";






export const Button = forwardRef(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-primary-600 text-white hover:bg-primary-700":
            variant === "primary",
            "bg-gray-100 text-gray-900 hover:bg-gray-200":
            variant === "secondary",
            "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700":
            variant === "outline",
            "hover:bg-gray-100 text-gray-700": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500":
            variant === "danger",
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-12 px-6 text-lg": size === "lg"
          },
          className
        )}
        {...props} />);


  }
);
Button.displayName = "Button";