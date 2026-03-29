export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  size: number;
}

export interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: Record<string, unknown>;
}

export interface GitHubStats {
  user: GitHubUser;
  repos: GitHubRepo[];
  events: GitHubEvent[];
  languages: Record<string, number>;
  totalStars: number;
  totalForks: number;
  topRepos: GitHubRepo[];
  activeDays: number;
  commitCount: number;
  prCount: number;
  issueCount: number;
  topLanguage: string;
  accountAgeDays: number;
  recentActivity: string[];
}

async function ghFetch<T>(url: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(url, { headers, next: { revalidate: 3600 } });
  if (!res.ok) {
    if (res.status === 404) throw new Error("해당 유저를 찾을 수 없습니다");
    if (res.status === 403) {
      const remaining = res.headers.get("x-ratelimit-remaining");
      if (remaining === "0") {
        const resetTime = res.headers.get("x-ratelimit-reset");
        const resetDate = resetTime ? new Date(Number(resetTime) * 1000) : null;
        const minutes = resetDate
          ? Math.ceil((resetDate.getTime() - Date.now()) / 60000)
          : "몇";
        throw new Error(
          `GitHub API 요청 한도 초과. 약 ${minutes}분 후에 다시 시도해 주세요.`
        );
      }
      throw new Error("GitHub API 접근이 거부되었습니다");
    }
    throw new Error(`GitHub API 오류: ${res.status}`);
  }
  return res.json();
}

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  const encoded = encodeURIComponent(username);

  const user = await ghFetch<GitHubUser>(
    `https://api.github.com/users/${encoded}`
  );

  // Fetch up to 200 repos (2 pages) for better coverage
  const [reposPage1, events] = await Promise.all([
    ghFetch<GitHubRepo[]>(
      `https://api.github.com/users/${encoded}/repos?per_page=100&sort=updated&type=owner`
    ),
    ghFetch<GitHubEvent[]>(
      `https://api.github.com/users/${encoded}/events/public?per_page=100`
    ),
  ]);

  let repos = reposPage1;

  // Fetch second page if user has >100 repos
  if (user.public_repos > 100) {
    try {
      const reposPage2 = await ghFetch<GitHubRepo[]>(
        `https://api.github.com/users/${encoded}/repos?per_page=100&sort=updated&type=owner&page=2`
      );
      repos = [...reposPage1, ...reposPage2];
    } catch {
      // Ignore second page errors
    }
  }

  // Language stats (weighted by repo size)
  const languages: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language && !repo.fork) {
      languages[repo.language] = (languages[repo.language] || 0) + repo.size;
    }
  }

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);

  const topRepos = [...repos]
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  // Event analysis
  const activeDaysSet = new Set<string>();
  let commitCount = 0;
  let prCount = 0;
  let issueCount = 0;

  for (const event of events) {
    const day = event.created_at.slice(0, 10);
    activeDaysSet.add(day);
    if (event.type === "PushEvent") {
      const commits = (event.payload as { commits?: unknown[] }).commits;
      commitCount += commits?.length || 0;
    }
    if (event.type === "PullRequestEvent") prCount++;
    if (event.type === "IssuesEvent") issueCount++;
  }

  const topLanguage =
    Object.entries(languages).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

  const accountAgeDays = Math.floor(
    (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  const recentActivity = events.slice(0, 10).map((e) => {
    const action =
      e.type === "PushEvent"
        ? "pushed to"
        : e.type === "PullRequestEvent"
          ? "opened PR in"
          : e.type === "IssuesEvent"
            ? "opened issue in"
            : e.type === "WatchEvent"
              ? "starred"
              : e.type === "ForkEvent"
                ? "forked"
                : e.type === "CreateEvent"
                  ? "created"
                  : "interacted with";
    return `${action} ${e.repo.name}`;
  });

  return {
    user,
    repos,
    events,
    languages,
    totalStars,
    totalForks,
    topRepos,
    activeDays: activeDaysSet.size,
    commitCount,
    prCount,
    issueCount,
    topLanguage,
    accountAgeDays,
    recentActivity,
  };
}
