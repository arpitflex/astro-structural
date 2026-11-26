import type { Month, TraceGroup } from '@data/trace';
import { MONTHS } from '@lib/dates';

/** Earliest role start: roles are listed most recent first. */
export function groupStart(group: TraceGroup): Month {
  return group.roles[group.roles.length - 1].start;
}

/** Latest role end, or undefined while the most recent role is current. */
export function groupEnd(group: TraceGroup): Month | undefined {
  return group.roles[0].end;
}

/** The build month (UTC, like every other date on the site), zero-padded like the data. */
function thisMonth(): Month {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}` as Month;
}

/** apr 2025 */
export function formatMonth(month: Month): string {
  const [year, index] = parse(month);
  return `${MONTHS[index]} ${year}`;
}

/** 1y 6m; open-ended roles run to this month. */
export function formatDuration(start: Month, end: Month = thisMonth()): string {
  const total = Math.max(1, ordinal(end) - ordinal(start));
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (years) parts.push(`${years}y`);
  if (months) parts.push(`${months}m`);
  return parts.join(' ');
}

/** One year per content column: lanes sit in --col-content, which is eight columns wide. */
const WINDOW_YEARS = 8;

/** The years every lane is drawn in: `to` is exclusive, so 2019–2027 draws eight columns. */
export interface TraceWindow {
  from: number;
  to: number;
}

/** The eight years every lane is drawn in, one page column each, ending with the current year. */
export function traceWindow(): TraceWindow {
  const to = new Date().getUTCFullYear() + 1;
  return { from: to - WINDOW_YEARS, to };
}

/** Lane geometry as custom properties: percentages of the window. */
export function lane(start: Month, end: Month | undefined, window: TraceWindow) {
  const pct = (month: Month) => {
    const [year, index] = parse(month);
    const position = (year + index / 12 - window.from) / (window.to - window.from);
    return `${(Math.min(1, Math.max(0, position)) * 100).toFixed(2)}%`;
  };
  return { '--from': pct(start), '--to': pct(end ?? thisMonth()) };
}

function parse(month: Month): [year: number, monthIndex: number] {
  const [year, m] = month.split('-').map(Number);
  return [year, m - 1];
}

function ordinal(month: Month): number {
  const [year, index] = parse(month);
  return year * 12 + index;
}
