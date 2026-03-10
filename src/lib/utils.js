import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateInvoiceNumber(prefix = "INV") {
  const dateStr = format(new Date(), "yyyyMMdd");
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  return `${prefix}-${dateStr}-${randomStr}`;
}