
import { forwardRef } from "react";
import { cn } from "../../lib/utils";







export const Select = forwardRef(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="w-full">
                {label &&
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1">
          
                        {label}
                    </label>
        }
                <select
          id={id}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-[url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}>
          
                    <option value="" disabled hidden>
                        Select an option
                    </option>
                    {options.map((option) =>
          <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
          )}
                </select>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>);

  }
);
Select.displayName = "Select";