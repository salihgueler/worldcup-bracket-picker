# ⚽ FIFA World Cup 2026 — Bracket Picker

A full-stack bracket prediction app for the FIFA World Cup 2026. Rank each group's top 3, select which third-place teams advance, predict knockout winners, chat with an AI match predictor, and compete on the leaderboard once results come in.

This branch contains only the **frontend** — the backend is built step-by-step using AWS Blocks with the prompts below.

## Tech Stack (Frontend)

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 5, TypeScript, Tailwind CSS 4 |

## Prerequisites

- **Node.js >= 22**
- **npm >= 10**

## Getting Started

### 1. Add AWS Blocks to this project

```bash
npm create @aws-blocks/blocks-app@latest .
npm install
```

This scaffolds an `aws-blocks/` folder into the project with the backend infrastructure, dev server, and deployment scripts.

### 2. Run the app

```bash
npm run dev
```

This starts:
- Vite frontend on `http://localhost:3000`
- Blocks backend on `http://localhost:3001`

### 3. Build the backend

Use the prompts below (in order) with your AI coding assistant to build out the full backend — auth, data, realtime, AI agent, and scheduled jobs.

## Prompts

Use these prompts in order with your AI coding assistant to build the complete backend:

### Auth

> Add a basic authentication to this app. Requirements: - Users should sign up with username and password - Protect all API routes - Add the Authenticator component

### Data First Iteration

> Add data storage for teams and matches: - Create a Table for teams with schema: teamId, type, name, group, fifaRanking, confederation, flagEmoji, roster (optional string for JSON) - Create a Table for matches with schema: matchId, matchType, stage, team1Id, team2Id, scheduledDate, result (optional), score (optional) - Add indexes: teams byGroup, matches byStage - Add an API method ensureSeeded() that checks if data exists and seeds 48 teams + matches from the static seed-data.ts file on first run - Call ensureSeeded() from the frontend after login

### Data Second Iteration

> Add a picks system so users can save their bracket selections using database. Requirements: - Create a Table for picks with schema: oddsType, oddsId, userId, matchId, predictedWinner, confidence (optional), createdAt - Add indexes: byUser (partitionKey: userId, sortKey: matchId), byMatch (partitionKey: matchId, sortKey: userId) - Add API methods: makePick(matchId, predictedWinner), getMyPicks(), getPicksForMatch(matchId) - Add a simple key value storage for leaderboard caching and bracket lock state - Add lockBracket() and isLocked() API methods

### Realtime

> Add realtime updates so users can see other people's picks appear live using Blocks Realtime. Requirements: - Create a Realtime block with a "picks" namespace - When a user makes a pick, publish an event with userId, username, matchId, predictedWinner - Add an API method getPicksChannel() that returns the channel for frontend subscription - Update the LiveFeed component to subscribe to this channel and display events in real time

### Agent

> Add an AI predictor agent using AWS Blocks Agent that can answer questions about teams and predict match outcomes. Requirements: - Create an Agent with model config: deployed uses Bedrock Claude Sonnet, local uses Ollama llama3.1:8b - System prompt: "You are the official AI predictor for FIFA World Cup 2026..." - Add tools: 1. lookupTeam — queries the teams DistributedTable by teamId (with fallback name search) 2. getTeamSquad — queries teams table and parses the roster JSON field 3. getMatchConsensus — queries picks table to show community distribution 4. getUserBracket — queries user's picks - Add API methods: chatWithPredictor(message), predictMatch(team1Id, team2Id) - Wire up the AIPredictorChat component to call api.chatWithPredictor()

### Scheduled Job

> Add a scheduled job that runs every hour to check for new match results and update the leaderboard using AWS Blocks. Requirements: - Create a scheduled job "rate(1 hour)". You can check this json for results and all. https://raw.githubusercontent.com/openfootball/worldcup.json/refs/heads/master/2026/worldcup.json - Handler: iterate all matches, find ones past their scheduledDate with no result, log them - After checking results, invalidate the leaderboard cache and make sure every relevant information is updated. - Add an updateMatchResult(matchId, result, score) API method for manual updates - Add a getLeaderboard() API method that scores users' picks against actual results
