# AI-Powered Assistant with Tool Calling

A chat-based AI assistant built with Next.js and TypeScript. Authenticated users interact with an LLM that invokes real-world tools to fetch live weather, Formula 1 race data, and stock prices. All conversations are persisted per user in a Neon Postgres database.

---

## Links
- **Live Demo:** https://assymetri-ruddy.vercel.app
 
## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Authentication | NextAuth.js v5 (Google + GitHub OAuth) |
| AI Integration | Vercel AI SDK (`streamText` + tool calling) |
| AI Provider | Groq (LLaMA 3.3 70B) |
| Database | Neon — serverless Postgres |
| ORM | Drizzle ORM |
| Deployment | Vercel |

---

## Features

### 1. Authentication & Authorization
- OAuth login via Google and GitHub
- Protected chat route — unauthenticated users are redirected to the login page
- Session managed via NextAuth.js v5 with JWT strategy

### 2. AI Chat with Tool Calling
The assistant responds to user queries and invokes one of three tools when appropriate:

| Tool | Input | Output | API |
|---|---|---|---|
| `weatherTool` | City name | Weather Card | OpenWeatherMap |
| `f1Tool` | Season / round | Race Card | Jolpica F1 (Ergast-compatible) |
| `stockTool` | Ticker symbol | Price Card | Finnhub |

- Responses stream in real time using `streamText` and `toUIMessageStreamResponse`
- Tool results are rendered as structured UI cards, not raw text
- Out-of-scope questions receive a polite refusal

### 3. Chat History Persistence
- Conversations and messages are stored per user in Neon Postgres
- Previous conversations load from the sidebar after login
- All database operations use Next.js Server Actions (`'use server'`)

### 4. SSR + CSR Strategy

**Server-rendered:**
- Landing page (`/`) — static, no client state
- Login page (`/login`) — no interactivity required
- Auth guard in protected layout — runs `auth()` on the server
- All DB reads/writes via Server Actions

**Client-rendered:**
- `ChatInterface` — manages streaming state, input, and message list
- `ConversationSidebar` — handles conversation switching
- `LoginButton`, `UserAvatar` — require browser session context

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/            # Login page (SSR)
│   ├── (protected)/chat/        # Chat page (CSR)
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth route handlers
│   │   └── chat/                # AI streaming endpoint (Edge runtime)
│   ├── layout.tsx               # Root layout with SessionProvider
│   └── page.tsx                 # Landing page
├── components/
│   ├── auth/                    # LoginButton, UserAvatar, SessionProvider, SignOutButton
│   ├── chat/                    # ChatInterface, ChatMessage, ConversationSidebar, TypingIndicator
│   ├── tools/                   # WeatherCard, F1Card, StockCard
│   └── ui/                      # shadcn/ui base components
└── lib/
    ├── ai/config.ts             # Groq client setup
    ├── auth/config.ts           # NextAuth configuration
    ├── db/
    │   ├── index.ts             # Drizzle + Neon client
    │   ├── schema.ts            # Table definitions (users, accounts, conversations, messages)
    │   └── actions.ts           # Server Actions for chat history
    └── tools/                   # weatherTool, f1Tool, stockTool definitions
```

---

## Setup Instructions

### 1. Clone and install dependencies

```bash
git clone https://github.com/Ruthvik-gr/Assymetri
cd ai-assistant
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root with the following keys:

```env
# Neon Postgres
DATABASE_URL=

# NextAuth
AUTH_URL=http://localhost:3000
AUTH_SECRET=          # generate with: openssl rand -base64 32

# Google OAuth — console.cloud.google.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub OAuth — github.com/settings/developers
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Groq — console.groq.com
GROQ_API_KEY=

# OpenWeatherMap — openweathermap.org/api
OPENWEATHER_API_KEY=
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5

# Finnhub — finnhub.io
FINNHUB_API_KEY=
FINNHUB_BASE_URL=https://finnhub.io/api/v1

# F1 API (Jolpica — Ergast-compatible, no key required)
ERGAST_BASE_URL=https://api.jolpi.ca/ergast/f1
```

### 3. Push the database schema

```bash
npx drizzle-kit push
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

1. Push the repository to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel project settings
4. Update OAuth callback URLs to your production domain:
   - Google: `https://your-app.vercel.app/api/auth/callback/google`
   - GitHub: `https://your-app.vercel.app/api/auth/callback/github`
5. Run `npx drizzle-kit push` with the production `DATABASE_URL` to migrate the live database

---

## API Key Sources

| Service | Where to get the key |
|---|---|
| Neon | [neon.tech](https://neon.tech) — free tier available |
| Google OAuth | [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials |
| GitHub OAuth | [github.com/settings/developers](https://github.com/settings/developers) → OAuth Apps |
| Groq | [console.groq.com](https://console.groq.com) — free tier available |
| OpenWeatherMap | [openweathermap.org/api](https://openweathermap.org/api) — free tier available |
| Finnhub | [finnhub.io](https://finnhub.io) — free tier available |
| Jolpica F1 API | No key required — open API |
