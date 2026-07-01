# Brain Balance: Emotion & Rational

A futuristic brain-training simulator that helps you balance emotional signals
with logical reasoning using the ABC (Ask / Balance / Choose) system.

This is a fully static site — no backend, no API key, and no per-use cost.
It's built with Vite + React + Tailwind and deploys for free on GitHub Pages.

## Run locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open the printed local URL (defaults to `http://localhost:3000`).

`npm run dev` and `npm run build` both automatically run
`npm run fetch-images` first, which downloads the 10 scenario background
photos from Unsplash into `public/images/`. That only needs network access
once per machine — the script skips any file that already exists, so re-runs
are instant and offline-safe. If you'd rather ship the repo fully
offline-independent, just commit the downloaded files in `public/images/`
once and the script will leave them alone from then on.

## Deploy to GitHub Pages (free)

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).

`.github/workflows/deploy.yml` does the rest: it installs dependencies,
fetches the scenario images, builds the site with Vite, and publishes
`dist/` to GitHub Pages. Every push to `main` triggers a fresh deploy.
Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

Because the build output is static files, hosting costs nothing and there's
no usage-based billing — GitHub Pages and GitHub Actions are both free for
public repositories.

## Project structure

- `src/App.tsx` — all screens and game logic
- `src/data/scenarios.ts` — the 10 scenarios, choices, and feedback copy
- `scripts/fetch-images.mjs` — downloads the scenario background photos
- `public/images/` — localized scenario photos (populated by the script above)
