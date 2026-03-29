import type { GitHubStats } from "./github";

export interface WrappedAnalysis {
  codingMBTI: string;
  mbtiTitle: string;
  mbtiDescription: string;
  personality: string;
  roast: string;
  strengths: string[];
  funFacts: string[];
  commitStyle: string;
  spirit_animal: string;
  summary: string;
}

export interface WrappedData {
  stats: GitHubStats;
  analysis: WrappedAnalysis;
}

export function buildAnalysisPrompt(stats: GitHubStats): string {
  const langList = Object.entries(stats.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([lang, size]) => `${lang}: ${size}`)
    .join(", ");

  const topRepoList = stats.topRepos
    .map(
      (r) =>
        `${r.name} (★${r.stargazers_count}, ${r.language || "unknown"}) - ${r.description || "no desc"}`
    )
    .join("\n");

  return `Analyze this GitHub developer profile and generate a fun "Wrapped" analysis. Be witty, creative, and meme-worthy. Write in a mix of Korean and English (like how Korean developers actually talk).

## Developer Profile
- Username: ${stats.user.login}
- Name: ${stats.user.name || "Unknown"}
- Bio: ${stats.user.bio || "No bio"}
- Account Age: ${stats.accountAgeDays} days
- Public Repos: ${stats.user.public_repos}
- Followers: ${stats.user.followers} / Following: ${stats.user.following}

## Stats (recent activity)
- Commits (recent): ${stats.commitCount}
- PRs: ${stats.prCount}
- Issues: ${stats.issueCount}
- Active Days (last 90): ${stats.activeDays}
- Total Stars: ${stats.totalStars}
- Total Forks: ${stats.totalForks}

## Languages (by code size)
${langList}

## Top Repos
${topRepoList}

## Recent Activity
${stats.recentActivity.join("\n")}

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "codingMBTI": "4-letter code like ENFP-debug or INTJ-deploy (make it coding-themed and funny)",
  "mbtiTitle": "Korean title for this MBTI type, max 15 chars (e.g., '새벽형 디버거', '풀스택 몽상가')",
  "mbtiDescription": "2-sentence Korean description of this coding personality type. Be funny and relatable.",
  "personality": "One-line developer personality summary in Korean (witty, meme-worthy)",
  "roast": "A friendly roast of the developer in Korean (funny but not mean). Reference their actual repos/languages.",
  "strengths": ["strength1 in Korean", "strength2", "strength3"],
  "funFacts": ["fun fact 1 about their GitHub in Korean", "fun fact 2", "fun fact 3"],
  "commitStyle": "Describe their commit style in Korean (e.g., '새벽 3시에 force push하는 타입')",
  "spirit_animal": "A coding spirit animal with emoji (e.g., '🦉 야행성 디버깅 올빼미')",
  "summary": "A viral-worthy 2-sentence summary for sharing in Korean. Make it sound like a Spotify Wrapped card."
}`;
}
