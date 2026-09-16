# StartupMentor AI

A full-stack web app that evaluates a startup idea with an LLM and returns a structured, scored critique rather than a wall of prose.

You describe an idea — along with its target market, audience, pricing model, and industry — and get back a success score out of 100, strengths, weaknesses, market and competition analysis, location-specific insights, improvement suggestions, monetization options, and a recommended MVP.

## Why the scoring is structured

The interesting problem here isn't calling an LLM, it's getting an answer that's consistent and actually useful. Ask a model to "rate this idea" and the same idea scores 65 one run and 88 the next, with reasoning that shifts each time.

So the score is anchored to an explicit rubric in the system prompt — five factors, 20 points each:

| Factor | What it measures |
|---|---|
| Market Size & Growth Potential | Demand and future potential of the target market |
| Value Proposition & Differentiation | How unique or competitive the idea is |
| Feasibility & Execution | Technical and operational viability |
| Monetization Clarity | Strength and variety of revenue paths |
| Target Audience Fit | Whether it meets a real, specific need |

The model is told to apply the same rubric every time and to be honest rather than encouraging — the default failure mode of an LLM asked to critique is flattery.

Output reliability is handled in three layers:

1. The request uses OpenAI's JSON mode (`response_format: { type: "json_object" }`), so the response is parseable by construction.
2. The server validates the *shape* of what comes back — each list field must really be an array, each prose field really a string — rather than just checking the keys exist.
3. The score is coerced to a number and clamped to 0–100.

The client then treats the list fields defensively too, so a malformed response degrades to a missing section instead of a blank page.

## Architecture

```
client/  →  React + TypeScript + Vite + shadcn/ui + Tailwind
   │
   │  POST /api/evaluate-idea
   ▼
Server/  →  Express
   │
   ▼
OpenAI Chat Completions (JSON mode)
```

The two halves run independently; the client reaches the server through `VITE_API_URL`.

### Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/evaluate-idea` | Evaluate an idea. Body: `description` (required), `location`, `audience`, `pricingModel`, `industry` |
| GET | `/health` | Health check |

Requests are rate limited to 20 per 15 minutes per IP, and input length is capped, since every evaluation costs an API call.

## Getting started

### Prerequisites
- Node.js 18+
- An OpenAI API key

### Backend

```bash
cd Server
npm install
cp .env.example .env      # then add your OPENAI_API_KEY
npm run dev               # http://localhost:5000
```

### Frontend

```bash
cd client
npm install
cp .env.example .env      # defaults to http://localhost:5000
npm run dev
```

## Deployment

`Server/vercel.json` configures the backend for Vercel. Set `OPENAI_API_KEY` as an environment variable in the Vercel project — never commit it. When deploying the client, point `VITE_API_URL` at the deployed backend; Vite inlines environment variables at build time, so it must be set before building.

## Credits and scope

The UI was initially scaffolded with Lovable. The backend, the prompt and rubric design, the response validation, and the wiring between the two are my own work.

## Known limitations

- No persistence — evaluations are not saved, so there's no history or comparison between ideas.
- No authentication; rate limiting is per-IP only.
- The "Generate Pitch Deck Outline" button is a placeholder.
- No automated tests.
