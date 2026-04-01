<div align="center">

<br />

# README.me

**Spotify Wrapped, but for your GitHub.**

Just enter a GitHub username.<br />
AI analyzes your coding personality and generates a shareable developer card.

**English** | [한국어](README.md)

<br />

<a href="https://readme-me-github.vercel.app/">
  <img src="https://img.shields.io/badge/Live Demo-README.me-58a6ff?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
</a>

<br /><br />

<img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
<img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
<img src="https://img.shields.io/badge/OpenAI-gpt--4o--mini-412991?style=flat-square&logo=openai&logoColor=white" alt="OpenAI" />
<img src="https://img.shields.io/badge/Framer Motion-12-e846ff?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />

<br /><br />

<img src="main.png" alt="README.me preview" width="640" />

</div>

<br />

## What is this?

> _"My coding MBTI is INTJ-deploy" — share yours._

**README.me** turns your GitHub profile into a **Spotify Wrapped**–style experience.

Enter a username and AI reads your repos, languages, and activity to generate a **Coding MBTI**, a **friendly roast**, and a **shareable developer card**. No login or token required — works entirely with public data.

<br />

## Features

<table>
  <tr>
    <td width="50%">

**Coding MBTI**<br />
<sub>AI-generated developer personality type</sub><br />
<code>ENFP-debug</code> <code>ISTJ-refactor</code> <code>INTJ-deploy</code>

**6 Animated Slides**<br />
<sub>Swipe / tap / arrow keys to navigate</sub>

**Language DNA**<br />
<sub>Visual breakdown of your top programming languages</sub>

**Activity Report**<br />
<sub>Commits, PRs, active days, and commit style analysis</sub>

  </td>
  <td width="50%">

**Friendly Roast**<br />
<sub>AI roasts your GitHub profile (nicely)</sub>

**Share Card**<br />
<sub>Share to X (Twitter), LinkedIn, or download as PNG</sub>

**Auto OG Images**<br />
<sub>Social media preview cards generated on the fly</sub>

**No Login Required**<br />
<sub>Works with public GitHub data only — zero auth</sub>

  </td>
  </tr>
</table>

<br />

## Slides

| # | Slide | Content |
|:---:|---|---|
| 1 | **Intro** | Avatar, name, account age, repos / followers / stars |
| 2 | **Language DNA** | Top 6 languages with animated progress bars |
| 3 | **Activity Report** | Commits, active days, PRs, forks, commit style, spirit animal |
| 4 | **Coding MBTI** | MBTI type, title, description, personality summary, strengths |
| 5 | **Roast** | Friendly roast, fun facts, best repos |
| 6 | **Share** | Preview card, social share buttons, card download |

<br />

## How It Works

```
Enter GitHub username
       │
       ▼
  /api/analyze (POST)
       │
       ├── GitHub REST API
       │     ├── /users/{username}           profile
       │     ├── /users/{username}/repos     repos (up to 200)
       │     └── /users/{username}/events    recent activity (up to 100)
       │
       ├── Process stats
       │     ├── Language distribution (weighted by repo size)
       │     ├── Star / fork totals
       │     ├── Activity metrics (commits, PRs, issues, active days)
       │     └── Top repositories
       │
       └── OpenAI API (gpt-4o-mini)
             └── Coding MBTI, roast, personality analysis,
                 fun facts, shareable summary
       │
       ▼
  /wrapped/{username}
  6 animated slides + share card
```

<br />

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Styling** | Tailwind CSS 4 |
| **Animation** | Framer Motion |
| **AI** | OpenAI API (gpt-4o-mini) |
| **Data** | GitHub REST API |
| **OG Images** | @vercel/og (Edge Runtime) |
| **Language** | TypeScript |

<br />

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts       GitHub fetch + AI analysis
│   │   ├── og/route.tsx           OG image generation (Edge)
│   │   └── story/route.tsx        Story image for download
│   ├── wrapped/[username]/
│   │   ├── layout.tsx             Dynamic OG metadata
│   │   └── page.tsx               Wrapped slides page
│   ├── error.tsx                  Error boundary
│   ├── not-found.tsx              404 page
│   ├── globals.css                GitHub dark theme
│   ├── layout.tsx                 Root layout
│   └── page.tsx                   Landing page
├── components/
│   ├── Icons.tsx                  SVG icons
│   ├── ShareCard.tsx              Share slide + social buttons
│   └── WrappedSlides.tsx          All slides
└── lib/
    ├── analyze.ts                 AI prompt builder
    └── github.ts                  GitHub API client
```

<br />

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key — [get one here](https://platform.openai.com/api-keys)

### Install & Run

```bash
# Clone
git clone https://github.com/YeongJunJeong/README.me.git
cd README.me

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENAI_API_KEY=sk-your-key-here

# Optional: higher GitHub API rate limit (60/hr → 5,000/hr)
GITHUB_TOKEN=ghp_your-token-here
```

```bash
# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

<br />

## Environment Variables

| Variable | Required | Description |
|---|:---:|---|
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI analysis |
| `GITHUB_TOKEN` | - | GitHub personal access token for higher rate limits |

> Server-side caching (24hr) minimizes repeated API calls for the same user.

<br />

## License

[MIT](LICENSE)

---

<div align="center">

<br />

**[README.me](https://readme-me-github.vercel.app/)** — _Your code tells a story._

<br />

</div>
