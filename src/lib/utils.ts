import { actionEnum, type AuditLogsSelect } from "~/server/db/schema";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges and normalizes class names using `clsx` and `tailwind-merge`.
 * @param inputs - Class names to merge.
 * @returns Merged class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Capitalizes each word in a string separated by a specified separator.
 * @param str - The input string.
 * @param separator - The separator to split the string by (default is a space).
 * @returns The capitalized string.
 */
export function capitalizeOrg(str: string, separator = " "): string {
  return str
    .split(separator)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Formats a date string to a local date format.
 * @param dateStr - The date string to format.
 * @param locale - The locale to use for formatting (default is 'en-US').
 * @returns The formatted date string.
 */
export const formatDateToLocal = (dateStr: string, locale = "en-US"): string => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Constructs an absolute URL using the provided path and the public app URL.
 * @param path - The path to append to the base URL.
 * @returns The absolute URL.
 */
export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}${path}`;
}

export function generateLogMessage(log: AuditLogsSelect) {
  const { action, entityTitle, entityType } = log;

  switch (action) {
    case actionEnum.CREATE:
      return `created ${entityType.toLowerCase()} "${entityTitle}"`;
    case actionEnum.UPDATE:
      return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
    case actionEnum.DELETE:
      return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `unknown action ${entityType.toLowerCase()} "${entityTitle}"`;
  }
}
