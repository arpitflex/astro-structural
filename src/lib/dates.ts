export const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** 14 aug 2026 */
export function formatDate(date: Date): string {
  return `${formatDayMonth(date)} ${date.getUTCFullYear()}`;
}

/** 14 aug */
export function formatDayMonth(date: Date): string {
  return `${String(date.getUTCDate()).padStart(2, '0')} ${MONTHS[date.getUTCMonth()]}`;
}

/** 2026-08-14, for datetime attributes and schema.org */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
