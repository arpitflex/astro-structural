import { GITHUB_TOKEN } from 'astro:env/server';

const WEEKS = 48;
const DAYS = WEEKS * 7;

/** A day's contribution level, the five steps of --heat-0 to --heat-4. */
export type Level = 0 | 1 | 2 | 3 | 4;

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
 * Combines contribution counts across one or more accounts and maps them to quartile levels.
 * Returns null without a token or when GitHub cannot be reached; the home page
 * then leaves the commit field out rather than show made-up activity.
 */
export async function getContributionLevels(logins: string | readonly string[]): Promise<Level[] | null> {
  const userList = Array.isArray(logins) ? logins : [logins];
  if (userList.length === 0) return null;

  if (!GITHUB_TOKEN) {
    console.warn('[github] GITHUB_TOKEN is not set; leaving the commit field out');
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
      return recentCounts.map(() => 0);
    }

    if (maxCount <= 4) {
      return recentCounts.map((count) => Math.min(4, count) as Level);
    }

    const step = maxCount / 4;
    return recentCounts.map((count) => (count === 0 ? 0 : (Math.min(4, Math.ceil(count / step)) as Level)));
  } catch (error) {
    console.warn(`[github] ${error instanceof Error ? error.message : error}; leaving the commit field out`);
    return null;
  }
}
