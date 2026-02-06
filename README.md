# Stagehand Research Agent

[Demo]() | [Browserbase](https://browserbase.com) | [Stagehand](https://stagehand.dev)

An AI-powered research agent that runs **5 parallel browser sessions** to search the web in real-time. Watch AI agents browse Google, Wikipedia, YouTube, Hacker News, and Google News simultaneously, then synthesize findings into a comprehensive summary.


## Features

- **Parallel Browser Sessions**: 5 browsers run simultaneously, each researching a different source
- **Live Browser Views**: Watch AI agents navigate the web in real-time
- **Multi-Source Research**: Searches Google, Wikipedia, YouTube, Hacker News, and Google News
- **AI-Powered Extraction**: Uses Claude to intelligently extract relevant information from pages
- **Smart Synthesis**: Combines findings into a structured, comprehensive summary
- **Real-time Streaming**: Server-Sent Events deliver results as they're discovered

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with React 19 and TypeScript
- **Styling**: Tailwind CSS 4
- **Markdown**: ReactMarkdown for rendering summaries

### Backend
- **AI Model**: Claude Sonnet via Vercel AI Gateway
- **Browser Automation**: [Stagehand](https://stagehand.dev) + [Browserbase](https://browserbase.com)
- **Streaming**: Server-Sent Events (SSE)
- **Runtime**: Next.js API Routes with 300s max duration

### Infrastructure
- **Browser Infrastructure**: Browserbase cloud browsers
- **AI Gateway**: Vercel AI Gateway
- **Deployment**: Vercel

## Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun
- [Browserbase](https://browserbase.com) account and API key
- [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) API key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/browserbase/research-agent-template
cd research-agent-template
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:

```env
# Vercel AI Gateway API Key
# Get yours at: https://vercel.com/docs/ai-gateway
AI_GATEWAY_API_KEY=your_ai_gateway_key

# Browserbase (for cloud browser sessions)
# Get yours at: https://browserbase.com
BROWSERBASE_PROJECT_ID=your_project_id
BROWSERBASE_API_KEY=your_api_key
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open your browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway API key for Claude access | Yes |
| `BROWSERBASE_API_KEY` | Your Browserbase API key | Yes |
| `BROWSERBASE_PROJECT_ID` | Your Browserbase project ID | Yes |

## Usage

1. **Enter a Query**: Type any research question or select from example queries:
   - "What is quantum computing?"
   - "Latest developments in AI"
   - "How does blockchain work?"

2. **Watch the Research**: See 5 browser windows researching in parallel, each exploring a different source

3. **Get Results**: Receive findings from each source as they complete, followed by an AI-synthesized summary

## How It Works

1. **Session Creation**: Creates 5 parallel Stagehand sessions on Browserbase
2. **Parallel Research**: Each session navigates to a different source (Google, Wikipedia, etc.)
3. **AI Extraction**: Claude extracts relevant information from each page using structured schemas
4. **Real-time Streaming**: Findings stream to the frontend as SSE events
5. **Synthesis**: Claude combines all findings into a formatted summary

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── research/
│   │       └── route.ts      # Research API with parallel Stagehand sessions
│   ├── components/           # React components
│   ├── context/              # Research context provider
│   ├── results/              # Results page
│   ├── page.tsx              # Home page
│   └── layout.tsx            # Root layout
├── public/                   # Static assets
└── .env.example              # Environment variables template
```

## License

MIT

## Acknowledgments

- [Browserbase](https://browserbase.com) - Cloud browser infrastructure
- [Stagehand](https://stagehand.dev) - AI-powered browser automation
- [Vercel](https://vercel.com) - Hosting and AI Gateway
- [Anthropic](https://anthropic.com) - Claude AI model
