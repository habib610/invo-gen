
import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Table = forwardRef(


  ({ className, ...props }, ref) =>
  <div className="w-full overflow-auto border border-gray-200 dark:border-gray-800 rounded-lg">
        <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm text-gray-900 dark:text-gray-100", className)}
      {...props} />
    
    </div>
);
Table.displayName = "Table";

export const TableHeader = forwardRef(


  ({ className, ...props }, ref) =>
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b dark:[&_tr]:border-gray-800 bg-gray-50 dark:bg-gray-900", className)}
    {...props} />

);
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef(


  ({ className, ...props }, ref) =>
  <tbody
    ref={ref}
    className={cn(
      "[&_tr:last-child]:border-0 divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950",
      className
    )}
    {...props} />

);
TableBody.displayName = "TableBody";

export const TableRow = forwardRef(


  ({ className, ...props }, ref) =>
  <tr
    ref={ref}
    className={cn(
      "border-b dark:border-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900 data-[state=selected]:bg-gray-50 dark:data-[state=selected]:bg-gray-900",
      className
    )}
    {...props} />

);
TableRow.displayName = "TableRow";

export const TableHead = forwardRef(


  ({ className, ...props }, ref) =>
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props} />

);
TableHead.displayName = "TableHead";

export const TableCell = forwardRef(


  ({ className, ...props }, ref) =>
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props} />

);
TableCell.displayName = "TableCell";