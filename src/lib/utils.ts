export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

type DateFormat = "short" | "long" | "month-year";

export function formatDate(
  timestamp: Date | string | null | undefined,
  format: DateFormat = "short",
): string {
  if (!timestamp) return "";

  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";

  const options: Intl.DateTimeFormatOptions =
    format === "long"
      ? { day: "numeric", month: "long", year: "numeric" }
      : format === "month-year"
        ? { month: "long", year: "numeric" }
        : { day: "numeric", month: "short" };

  return date.toLocaleDateString("en-GB", options);
}

export function getValidDate(
  timestamp: Date | string | null | undefined,
): Date {
  if (!timestamp) return new Date();
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}
