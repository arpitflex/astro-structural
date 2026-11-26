import { GITHUB_TOKEN } from 'astro:env/server';

const WEEKS = 48;
const DAYS = WEEKS * 7;

/** A day's contribution level, the five steps of --heat-0 to --heat-4. */
export type Level = 0 | 1 | 2 | 3 | 4;

export interface CommitFieldData {
  levels: Level[];
  /** Caption prefix: 'github' for live API data, 'activity' for the built-in template sample. */
  label: 'github' | 'activity';
}

export interface CommitFieldOptions {
  /** Render a deterministic sample grid when no GitHub users are configured. */
  sample?: boolean;
}

/** Deterministic 48-week sample activity for the unconfigured template preview. */
function sampleLevels(): Level[] {
  return Array.from({ length: DAYS }, (_, day) => {
    const week = Math.floor(day / 7);
    const weekday = day % 7;
    const isWeekend = weekday === 0 || weekday === 6;

    // Deterministic hash combining day and week so the 48-week grid looks organic without repeating stripes.
    let h = Math.imul(day + 17, 0x45d9f3b) ^ Math.imul(week + 31, 0x27d4eb2d);
    h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
    const roll = ((h ^ (h >>> 13)) >>> 0) % 100;

    // Periodic sprint bursts across weeks, lighter activity on weekends.
    const burst = week % 11 >= 3 && week % 11 <= 6 ? 12 : 0;
    const activeCutoff = (isWeekend ? 26 : 56) + burst;
    if (roll >= activeCutoff) return 0;

    const score = roll / activeCutoff;
    if (score < 0.42) return 1;
    if (score < 0.72) return 2;
    if (score < 0.9) return 3;
    return 4;
  });
}

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface CalendarResponse {
  errors?: { message: string }[];
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: {
            contributionDays: ContributionDay[];
          }[];
        };
      };
    };
  };
}

async function fetchUserDays(login: string): Promise<ContributionDay[]> {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'astro-structural'
    },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${login}`);

  const json = (await response.json()) as CalendarResponse;
  if (json.errors?.length) throw new Error(`${login}: ${json.errors[0].message}`);

  const weeks = json.data?.user?.contributionsCollection.contributionCalendar.weeks ?? [];
  return weeks.flatMap((week) => week.contributionDays);
}

/**
 * Contribution levels (0–4) for the past 48 weeks, oldest day first, ending today.
 * When `logins` is empty and `options.sample` is true, returns deterministic sample activity for the template.
 * Once `logins` is configured, queries GitHub's GraphQL API across all accounts using `GITHUB_TOKEN`,
 * returning null without a token or on fetch failure rather than showing synthetic activity for a real profile.
 */
export async function getContributionLevels(
  logins: string | readonly string[],
  options: CommitFieldOptions = {}
): Promise<CommitFieldData | null> {
  const userList = (Array.isArray(logins) ? logins : [logins]).map((login) => login.trim()).filter(Boolean);
  if (userList.length === 0) {
    return options.sample ? { levels: sampleLevels(), label: 'activity' } : null;
  }

  if (!GITHUB_TOKEN) {
    console.warn(
      `[github] GITHUB_TOKEN is not set; omitting the commit field for ${userList.join(', ')} (add GITHUB_TOKEN in .env or CI to enable)`
    );
    return null;
  }

  try {
    const userDaysList = await Promise.all(userList.map(fetchUserDays));

    const dailyCounts = new Map<string, number>();
    for (const days of userDaysList) {
      for (const day of days) {
        dailyCounts.set(day.date, (dailyCounts.get(day.date) ?? 0) + day.contributionCount);
      }
    }

    const sortedDates = Array.from(dailyCounts.keys()).sort();
    if (sortedDates.length < DAYS) throw new Error(`only ${sortedDates.length} days returned`);

    const recentDates = sortedDates.slice(-DAYS);
    const recentCounts = recentDates.map((date) => dailyCounts.get(date) ?? 0);
    const maxCount = Math.max(...recentCounts);

    if (maxCount === 0) {
      return { levels: recentCounts.map(() => 0), label: 'github' };
    }

    if (maxCount <= 4) {
      return { levels: recentCounts.map((count) => Math.min(4, count) as Level), label: 'github' };
    }

    const step = maxCount / 4;
    return {
      levels: recentCounts.map((count) => (count === 0 ? 0 : (Math.min(4, Math.ceil(count / step)) as Level))),
      label: 'github'
    };
  } catch (error) {
    console.warn(`[github] ${error instanceof Error ? error.message : error}; leaving the commit field out`);
    return null;
  }
}
