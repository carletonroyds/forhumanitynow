# Social Media Self-Evaluation

A short, slide-based self-assessment that scores how resilient someone is to common social media manipulation patterns (dopamine hijacking, confirmation bias, social comparison, and so on). Takes about a minute. One question per screen, auto-advances as you answer, ends with a scored summary.

Built with React + TypeScript + Vite, styled with Tailwind (via CDN).

## Run locally

**Prerequisites:** Node.js

```
npm install
npm run dev
```

This starts a local dev server (Vite) and prints a URL to open in your browser.

## Build for production

```
npm run build
```

Outputs a static build to `dist/`, deployable to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Project structure

- `App.tsx` — top-level state machine (welcome → questions → results), keyboard/swipe navigation, auto-advance timing
- `components/WelcomeScreen.tsx` — intro screen
- `components/QuestionSlide.tsx` — single question + 1–10 rating
- `components/ProgressBar.tsx` — progress bar and jumpable question dots
- `components/ResultsScreen.tsx` — animated score gauge, tier, strongest/weakest areas
- `constants.ts` — the questions and scoring tiers
- `types.ts` — shared TypeScript types
