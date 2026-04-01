<div align="center">

# README.me

### Your GitHub Wrapped

**English** | [한국어](README.md)

[🚀 Live Demo →](https://readme-me-github.vercel.app/)

<img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
<img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss" alt="Tailwind" />
<img src="https://img.shields.io/badge/OpenAI-gpt--4o--mini-412991?logo=openai" alt="OpenAI" />
<img src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" alt="Vercel" />

<br /><br />

<img src="main.png" alt="README.me preview" width="600" />

</div>

---

## What is this?

**README.me** turns your GitHub profile into a Wrapped-style card experience — like Spotify Wrapped, but for developers.

Enter a GitHub username, and the app will:

1. **Fetch** public GitHub data (repos, languages, activity, stars)
2. **Analyze** it with AI to generate a fun coding personality
3. **Present** the results as swipeable animated slides
4. **Generate** a shareable card with your Coding MBTI

> _"My coding MBTI is INTJ-deploy" — share yours._

---

## Features

| Feature | Description |
|---|---|
| **Coding MBTI** | AI-generated personality type like `ENFP-debug`, `ISTJ-refactor` |
| **6 Animated Slides** | Swipe, tap, or use arrow keys to navigate |
| **Language DNA** | Visual breakdown of your top programming languages |
| **Activity Report** | Commits, PRs, active days, and commit style analysis |
| **Friendly Roast** | AI roasts your GitHub profile (nicely) |
| **Share Card** | Share to X (Twitter), LinkedIn, or download as PNG |
| **OG Image** | Auto-generated preview image for social media links |
| **No Login Required** | Works with public GitHub data — no token needed |

---

## Slides

| # | Slide | Content |
|---|---|---|
| 1 | **Intro** | Avatar, name, account age, repos, followers, stars |
| 2 | **Language DNA** | Top 6 languages with animated progress bars |
| 3 | **Activity Report** | Commits, active days, PRs, forks, commit style, spirit animal |
| 4 | **Coding MBTI** | MBTI type, title, description, personality summary, strengths |
| 5 | **Roast** | Friendly roast, fun facts, best repos |
| 6 | **Share** | Preview card, social share buttons, download |

---

## Tech Stack

```
Frontend     Next.js 16 (App Router) + React 19
Styling      Tailwind CSS 4
Animation    Framer Motion
AI           OpenAI API (gpt-4o-mini)
Data         GitHub REST API (no token required)
OG Image     @vercel/og (Edge Runtime)
Language     TypeScript
Deploy       Vercel
```

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts        # POST: GitHub fetch + AI analysis
│   │   ├── og/route.tsx            # GET: OG image generation (Edge)
│   │   └── story/route.tsx         # GET: Story image for download
│   ├── wrapped/[username]/
│   │   ├── layout.tsx              # Dynamic OG metadata
│   │   └── page.tsx                # Wrapped slides page
│   ├── error.tsx                   # Error boundary
│   ├── not-found.tsx               # 404 page
│   ├── globals.css                 # GitHub dark theme
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── components/
│   ├── Icons.tsx                   # SVG icons
│   ├── ShareCard.tsx               # Share slide + social buttons
│   └── WrappedSlides.tsx           # All 6 slides
└── lib/
    ├── analyze.ts                  # AI prompt builder
    └── github.ts                   # GitHub API client
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

```bash
git clone https://github.com/your-username/readmeme.git
cd readmeme
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENAI_API_KEY=sk-your-key-here

# Optional: higher GitHub API rate limit (60/hr -> 5000/hr)
GITHUB_TOKEN=ghp_your-token-here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/readmeme)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variable: `OPENAI_API_KEY`
4. Deploy

---

## How It Works

```
User enters username
        │
        ▼
   /api/analyze (POST)
        │
        ├── GitHub REST API
        │     ├── /users/{username}
        │     ├── /users/{username}/repos?per_page=100
        │     └── /users/{username}/events/public
        │
        ├── Process stats
        │     ├── Language distribution
        │     ├── Star/fork counts
        │     ├── Activity metrics
        │     └── Top repositories
        │
        └── OpenAI API (gpt-4o-mini)
              └── Generate coding MBTI, roast,
                  personality, fun facts, summary
        │
        ▼
   /wrapped/{username}
   6 animated slides + share card
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI analysis |
| `GITHUB_TOKEN` | No | GitHub personal access token for higher rate limits |

Server-side caching (24hr) minimizes repeated API calls for the same user.

---

## License

MIT

---

<div align="center">

**[README.me](https://readme.me)** — _Your code tells a story. Let's read it._

</div>
