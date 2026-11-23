# ⚽ FIFA World Cup 2026 — Bracket Picker

A full-stack bracket prediction app for the FIFA World Cup 2026. Rank each group's top 3, select which third-place teams advance, predict knockout winners, chat with an AI match predictor, and compete on the leaderboard once results come in.

Built with React 19, TypeScript, and AWS Blocks — runs locally with zero configuration.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 5, TypeScript, Tailwind CSS 4 |
| Backend | AWS CDK Blocks (`aws-cdk-blocks`) |
| Auth | AuthBasic (username/password + JWT sessions) |
| Data | DistributedTable (teams, matches, picks), KVStore (lock state) |
| Realtime | Realtime (WebSocket pub/sub for live pick feed) |
| AI | Agent (Claude Sonnet via Bedrock / Ollama locally) |
| API | ApiNamespace (type-safe RPC, zero serialization) |

## Features

### 🏆 48-Team Bracket
All 12 groups (A–L) with the real teams from the official FIFA draw (December 2025). Includes actual match dates, venues across USA/Canada/Mexico, and FIFA rankings.

### 📋 Bracket Picking Flow
1. **Group Stage** — Pick 🥇 1st, 🥈 2nd, and 🥉 3rd for each of the 12 groups (the 4th team is eliminated). Then select which 8 of your 12 third-place teams advance to the Round of 32 — all on the same page.
2. **Knockout Stage** — Round of 32 → Round of 16 → Quarter-finals → Semi-finals → 3rd Place → Final. Each round unlocks after the previous is complete.
3. **Lock In** — Review your full bracket and lock it permanently.

### 🥉 Best Third-Place Selection
After ranking all 12 groups, a section appears at the bottom of the Group Stage page showing your 12 third-place picks. Select 8 of them to advance to the R32. No separate page — it's all part of the group stage flow.

### 🔒 Lock-In System
Once all picks are complete, lock your bracket permanently. Locked brackets are persisted to the backend via `api.lockBracket()` (KVStore). Locked brackets cannot be modified.

### 👥 Team Rosters
Full 26-player official squads for all 48 teams, sourced from FIFA's June 2026 announcements. Searchable by team name or group, organized by position (GK/DEF/MID/FWD).

### 🤖 AI Predictor Agent
Chat with a Claude-powered AI that can:
- Predict match outcomes with confidence % and reasoning
- Look up team details (accepts 3-letter FIFA codes OR full country names)
- Show full squad rosters for any team
- Review your personal bracket picks
- Analyze community consensus on matches

### 📡 Realtime Live Feed
See other users' picks appear in real time via WebSocket.

### 📊 Leaderboard & Points System
Points calculated automatically once real match results come in. Shows the full scoring breakdown and maximum possible points.

### 🎯 Optional Score Predictions
For any knockout match, optionally predict the exact score for bonus points.

## Prerequisites

- **Node.js >= 22**
- AWS credentials (optional — only needed for Bedrock AI in local dev)

## Getting Started

```bash
git clone <repo-url>
cd worldcup-bracket-picker
npm install
npm run dev
```

This starts:
- Vite frontend on `http://localhost:3000`
- Blocks backend on `http://localhost:3001`

Sign up, log in, and start picking your bracket. On first login, `api.ensureSeeded()` auto-populates the database with all 48 teams (with rosters) and 88 group-stage matches — no manual seeding required.

## Local AI Testing

| Mode | Setup | Description |
|------|-------|-------------|
| **Ollama** | `ollama serve` + `ollama pull llama3.1:8b` | Real LLM via OpenAI-compatible API at `localhost:11434` |
| **Bedrock** (production) | AWS credentials | Claude Sonnet via Amazon Bedrock |

The agent is configured with `model.local` pointing to Ollama's OpenAI-compatible endpoint and `model.deployed` using Bedrock Claude Sonnet.

## Project Structure

```
worldcup-bracket-picker/
├── cdk-blocks/
│   ├── index.ts              # Backend: Blocks + API + Agent
│   ├── seed-data.ts          # Teams + matches seed data
│   ├── team-rosters.ts       # 48 team rosters (26 players each)
│   ├── index.cdk.ts          # CDK (generated)
│   ├── index.handler.ts      # Lambda handler (generated)
│   ├── client.js             # Auto-generated typed client
│   └── scripts/              # Dev server, sandbox, cleanup
├── src/
│   ├── main.tsx              # Vite + React entry
│   ├── App.tsx               # Layout + routing + auto-seed
│   ├── index.css             # Tailwind + custom theme
│   ├── components/
│   │   ├── AuthGate.tsx      # Login/signup
│   │   ├── Navbar.tsx        # Responsive nav with 5 tabs
│   │   ├── BracketFlow.tsx   # Bracket picking orchestrator (3 steps)
│   │   ├── GroupPicker.tsx   # 12-group 1st/2nd/3rd picker + 3rd-place advancement
│   │   ├── KnockoutPicker.tsx # Round-by-round knockout picker
│   │   ├── LockInSummary.tsx # Review + lock bracket
│   │   ├── MyBracket.tsx     # Full bracket visualization
│   │   ├── TeamRosters.tsx   # Searchable team/roster cards
│   │   ├── AIPredictorChat.tsx # AI chat interface
│   │   ├── Leaderboard.tsx   # Points system + rankings
│   │   └── LiveFeed.tsx      # Realtime pick events
│   ├── data/
│   │   ├── worldcup2026.ts   # 48 teams + 88 match schedule
│   │   ├── rosters.ts        # 1,248 players (48×26)
│   │   └── bracketConstants.ts # Bracket seedings + points
│   ├── hooks/
│   │   ├── useAuth.ts        # Auth state
│   │   ├── useBracket.ts     # Bracket state + localStorage persistence
│   │   ├── usePicks.ts       # Pick CRUD
│   │   └── useRealtime.ts    # WebSocket subscription
│   └── types/
│       └── index.ts          # Shared TypeScript types
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## AWS Blocks Used

| Block | Purpose |
|-------|---------|
| `ApiNamespace` | Type-safe RPC — all methods auto-typed on frontend |
| `AuthBasic` | Username/password auth with JWT sessions |
| `DistributedTable` | Teams (with rosters), matches, user picks (DynamoDB) |
| `KVStore` | Bracket lock state, leaderboard cache |
| `Realtime` | WebSocket pub/sub for live pick feed |
| `Agent` | AI predictor with 5 tools (Bedrock Claude Sonnet / Ollama) |
| `CronJob` | Hourly results sync — fetches match outcomes and recalculates leaderboard |

## How the AI Agent Works

The agent has 5 tools that query the DistributedTable database and the results feed:

| Tool | Description |
|------|-------------|
| `lookupTeam` | Get team details (ranking, group, confederation). Accepts 3-letter FIFA code or full name with fallback lookup. |
| `getTeamSquad` | Full 26-player roster grouped by position. Accepts code or name. |
| `getMatchConsensus` | Community pick distribution for a match |
| `getUserBracket` | Current user's group picks, knockout picks, lock status |
| `getMatchResult` | Actual result and score for a played match, using stored match results with live-feed fallback |

The system prompt instructs the agent to use 3-letter FIFA country codes (USA, BRA, ARG, GER, FRA, ENG, ESP, TUR, MEX, JPN, KOR). If the agent passes a full name instead, the fallback lookup handles it gracefully.

## Automatic Results Sync (CronJob)

An hourly CronJob runs during the tournament (June 11 – July 19, 2026) that:
1. Checks all matches whose scheduled date has passed
2. Fetches real match results from the openfootball World Cup JSON feed
3. Updates match records in DistributedTable with scores and outcomes
4. Invalidates the leaderboard cache so points are recalculated

A manual `api.updateMatchResult(matchId, result, score)` endpoint is also available for entering results directly (useful for testing or if the API is down).

## Points System

| Category | Points |
|----------|--------|
| Correct group qualifier (team advances) | 5 |
| Correct group position (1st vs 2nd) | +3 bonus |
| Correct Round of 32 winner | 5 |
| Correct Round of 16 winner | 8 |
| Correct Quarter-final winner | 12 |
| Correct Semi-final winner | 15 |
| Correct 3rd Place match | 10 |
| Correct World Cup winner | 20 |
| Correct score prediction | +5 bonus |

## Bracket Format (2026 FIFA World Cup)

- **48 teams** in 12 groups of 4
- User picks **1st, 2nd, and 3rd** in each group (4th is eliminated)
- **Top 2 per group** (24 teams) advance directly
- User selects **8 best 3rd-place teams** (from their 12 third-place picks) to also advance
- Total: **32 teams** enter the knockout stage
- **Round of 32** (16 matches) → Round of 16 (8) → Quarter-finals (4) → Semi-finals (2) → 3rd Place + Final
- Tournament: June 11 – July 19, 2026 across USA, Canada, and Mexico (16 venues)

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend + backend dev servers |
| `npm run typecheck` | TypeScript type checking |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run sandbox` | Deploy ephemeral AWS sandbox |
| `npm run sandbox:destroy` | Tear down sandbox |
| `npm run deploy` | Production deployment with Hosting |

## Deployment

```bash
npm run sandbox          # Deploy backend to AWS (ephemeral)
npm run deploy           # Production deploy with S3 + CloudFront
npm run sandbox:destroy  # Clean up
```
