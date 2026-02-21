# Copilot / AI Agent Instructions — fish (Vite + React)

Short, actionable instructions to help an AI coding agent be productive in this repo.

- Purpose: This is a minimal Vite + React single-page app (SPA). Use `src/main.jsx` as the app entry and `src/App.jsx` as the primary component.
- Build / Dev commands: `npm run dev` (local HMR), `npm run build` (production build), `npm run preview` (serve build), `npm run lint` (eslint).

Architecture notes
- Tooling: Vite + React 19. Project uses ES modules (`type: "module"` in package.json).
- Entry points: `src/main.jsx` mounts into `index.html` root node. `src/App.jsx` is the top-level UI component.
- Static assets: `src/assets/*` holds component images; root `/vite.svg` is served by Vite from project root (see `index.html`).

Conventions & patterns
- File extensions: JSX components use `.jsx` (not `.js` or `.tsx`). Keep to this convention when adding components.
- Styling: CSS files live next to components (e.g., `src/App.css`, `src/index.css`). Import them from components.
- React patterns: functional components + hooks (example: `useState` in `src/App.jsx`). Prefer modern React idioms; `StrictMode` is enabled in `src/main.jsx`.
- Import paths: Vite supports absolute root imports like `/vite.svg`. Use relative imports for local files under `src/` and absolute root for project-root assets.

Developer workflow specifics
- Local dev: run `npm run dev` — Vite provides HMR; editing `src/App.jsx` should update instantly.
- Production build: run `npm run build`. If a build fails, check console output and `vite` diagnostics; common issues are malformed imports or missing assets.
- Linting: run `npm run lint`. ESLint config is in the repo root (`eslint.config.js`). Follow existing lint rules; prefer minimal, targeted fixes.

Integration points & external deps
- No backend in this repo — it's a static SPA. External deps are listed in `package.json` (React and Vite tooling).
- Plugins: `@vitejs/plugin-react` is installed (see `devDependencies`). When touching build/plugins, keep Vite's plugin usage compatible with latest Vite config patterns.

Examples from this repo
- Entry: `src/main.jsx` — mounts `<App />`:

  import App from './App.jsx'

- Top-level component: `src/App.jsx` — uses `useState`, imports `src/assets/react.svg`, and `/vite.svg`.

What NOT to change without checking
- `index.html` and `src/main.jsx`: altering these can break the app bootstrap and HMR behavior.
- Root-level asset names referenced as `/name` (e.g., `/vite.svg`) — verify Vite asset location before renaming.

If you need to add tests or CI
- There are no tests configured. If adding tests, prefer a lightweight setup (Vitest or Jest) and document commands in `package.json`.

When in doubt
- Run `npm run dev` locally and reproduce the problem. Use browser console + terminal logs for debugging.
- Preserve the repo minimalism: prefer small, focused changes and keep the dependency footprint small.

Reference files
- `src/main.jsx`, `src/App.jsx`, `package.json`, `README.md`, `eslint.config.js`.

Ask for clarification if any codepaths or missing conventions need explicit rules.
