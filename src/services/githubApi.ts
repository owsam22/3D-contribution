export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface GithubUser {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  repositories: { totalCount: number };
  contributionsCollection: {
    contributionCalendar: ContributionCalendar;
    totalCommitContributions: number;
    totalPullRequestContributions: number;
    totalIssueContributions: number;
    totalRepositoryContributions: number;
    totalRepositoriesWithContributedCommits: number;
  };
}

export interface CityBuilding {
  date: string;
  count: number;
  week: number;
  day: number;
  height: number;
  color: string;
  type: 'skyscraper' | 'office' | 'apartment' | 'house' | 'park';
  x: number;
  z: number;
}

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const CONTRIBUTION_QUERY = `
query($login: String!, $from: DateTime, $to: DateTime) {
  user(login: $login) {
    login
    name
    avatarUrl
    bio
    followers { totalCount }
    following { totalCount }
    repositories(privacy: PUBLIC) { totalCount }
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoryContributions
      totalRepositoriesWithContributedCommits
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
    }
  }
}
`;

export async function fetchGithubUser(
  login: string,
  token?: string,
  year?: number
): Promise<GithubUser> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let variables: Record<string, string> = { login };
  if (year) {
    variables = {
      login,
      from: `${year}-01-01T00:00:00Z`,
      to: `${year}-12-31T23:59:59Z`,
    };
  }

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: CONTRIBUTION_QUERY,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    const msg = data.errors[0]?.message || 'GitHub GraphQL error';
    throw new Error(msg);
  }

  if (!data.data?.user) {
    throw new Error(`User "${login}" not found`);
  }

  return data.data.user;
}

export function buildingTypeFromCount(count: number): CityBuilding['type'] {
  if (count === 0) return 'park';
  if (count <= 2) return 'house';
  if (count <= 5) return 'apartment';
  if (count <= 10) return 'office';
  return 'skyscraper';
}

export function buildingHeightFromCount(count: number, maxCount: number): number {
  if (count === 0) return 0;
  const normalized = count / Math.max(maxCount, 1);
  // Exponential scale so high contributors really tower over low ones
  const scaled = Math.pow(normalized, 0.65);
  return 0.15 + scaled * 5.2;
}

export function contributionsToCityData(user: GithubUser): CityBuilding[] {
  const weeks = user.contributionsCollection.contributionCalendar.weeks;
  const allDays: ContributionDay[] = [];
  weeks.forEach((week) => week.contributionDays.forEach((day) => allDays.push(day)));

  const maxCount = Math.max(...allDays.map((d) => d.contributionCount), 1);

  const buildings: CityBuilding[] = [];

  weeks.forEach((week, weekIdx) => {
    week.contributionDays.forEach((day, dayIdx) => {
      const type = buildingTypeFromCount(day.contributionCount);
      const height = buildingHeightFromCount(day.contributionCount, maxCount);

      // Grid layout: weeks along X axis, days along Z axis
      const spacing = 1.35;
      const x = (weekIdx - weeks.length / 2) * spacing;
      const z = (dayIdx - 3) * spacing;

      // Use GitHub's native color but ensure it shows on dark background
      let color = day.color;
      if (color === '#ebedf0' || color === '#161b22' || color === '#ebedf0') {
        color = '#0d2318';
      }

      buildings.push({
        date: day.date,
        count: day.contributionCount,
        week: weekIdx,
        day: dayIdx,
        height,
        color,
        type,
        x,
        z,
      });
    });
  });

  return buildings;
}

export function generateDemoData(): GithubUser {
  const weeks: ContributionWeek[] = [];
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 364);

  const githubColors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

  // Create realistic-looking contribution pattern
  for (let w = 0; w < 53; w++) {
    const days: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + w * 7 + d);

      // Weekends have fewer contributions
      const isWeekend = d === 0 || d === 6;
      const rand = Math.random();
      let count = 0;
      let color = githubColors[0];

      // 30% no activity, more on weekends
      const noActivityThreshold = isWeekend ? 0.6 : 0.2;
      if (rand > noActivityThreshold) {
        // Simulate realistic distribution: mostly small, some large
        const baseCount = Math.floor(Math.pow(Math.random(), 1.5) * 20);
        count = Math.max(1, baseCount);

        // Occasional "crunch" days
        if (Math.random() < 0.05) count = Math.floor(15 + Math.random() * 20);

        if (count <= 1) color = githubColors[1];
        else if (count <= 4) color = githubColors[2];
        else if (count <= 8) color = githubColors[3];
        else color = githubColors[4];
      }

      days.push({
        date: date.toISOString().split('T')[0],
        contributionCount: count,
        color,
      });
    }
    weeks.push({ contributionDays: days });
  }

  // Calculate totals from generated data
  let totalCommits = 0;
  weeks.forEach((w) => w.contributionDays.forEach((d) => (totalCommits += d.contributionCount)));

  return {
    login: 'demo-user',
    name: 'Demo Developer',
    avatarUrl: '',
    bio: '👋 This is demo data. Search a GitHub username to see their city!',
    followers: { totalCount: 127 },
    following: { totalCount: 84 },
    repositories: { totalCount: 23 },
    contributionsCollection: {
      totalCommitContributions: Math.floor(totalCommits * 0.85),
      totalPullRequestContributions: Math.floor(totalCommits * 0.1),
      totalIssueContributions: Math.floor(totalCommits * 0.05),
      totalRepositoryContributions: 8,
      totalRepositoriesWithContributedCommits: 17,
      contributionCalendar: {
        totalContributions: totalCommits,
        weeks,
      },
    },
  };
}
