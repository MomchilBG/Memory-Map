# Memory Map

@AGENTS.md

## Project

Memory Map is an early-stage web app. The repository is a pnpm + Turborepo monorepo that so far contains only the scaffolding; features are tracked as GitHub issues on `MomchilBG/Memory-Map` (use the `gh` CLI to read them).

## Layout

- `apps/web` — the React Router v8 app (framework mode, Vite, Tailwind CSS v4). Next.js was removed in favour of React Router.
- `apps/api` — the NestJS 12 API (Fastify adapter, SWC builder, ESM, Vitest). Listens on `PORT`, default 3000. The web app reaches it from its server-side loaders through the `API_URL` environment variable, default `http://localhost:3000`. It uses Drizzle ORM with Postgres: the schema is in `src/database/schema.ts`, migrations are in `apps/api/drizzle` and are applied automatically when the api starts. The connection string comes from `DATABASE_URL`, default `postgres://postgres:postgres@localhost:5432/memory_map`.
- `apps/e2e` — Playwright end-to-end tests (Chromium). They run against an already running app at `BASE_URL`, default `http://localhost:5173`.
- `packages/ui` — shared React components, exported as source (`@repo/ui/*` maps to `src/*.tsx`).
- `packages/typescript-config` — shared `tsconfig` bases.
- `.agents/skills` and `apps/web/react-router` — vendored agent skills tracked by `skills-lock.json`. Do not edit or format them.

## Tooling

- Package manager: pnpm 11 (`packageManager` is pinned). Do not use npm or yarn, and do not commit a `package-lock.json`.
- Node 24 or newer is required by `engines`. The Nest CLI crashes on older versions.
- TypeScript 7.
- Linting: oxlint with type-aware rules enabled (`.oxlintrc.json`, backed by `oxlint-tsgolint`).
- Formatting: oxfmt (`.oxfmtrc.json`). There is no ESLint or Prettier in this repo.
- Line endings are LF everywhere, enforced by `.gitattributes`.

## Commands

Run from the repository root:

- `docker compose up -d db` — start the local Postgres database. The api needs it, so run this before `pnpm dev` or the api e2e tests.
- `pnpm dev` — start the dev servers.
- `pnpm build` — build all apps and packages.
- `pnpm lint` / `pnpm lint:fix` — run oxlint.
- `pnpm format` / `pnpm format:fix` — check or apply oxfmt formatting.
- `pnpm check-types` — type-check every package.
- `pnpm --filter api test` / `pnpm --filter api test:e2e` — run the API tests.
- `pnpm --filter api db:generate` — generate a migration after changing the schema. Do not edit `apps/api/drizzle/meta` by hand.
- `pnpm --filter e2e test:e2e` — run the Playwright tests; start the database and `pnpm dev` first. Browsers are installed with `pnpm --filter e2e exec playwright install chromium`.
- `docker compose up --build` — build and run the production images; web is on http://localhost:8080 and api on http://localhost:3000.
- `pnpm exec turbo run lint format check-types` — all checks in one go.

Lint and format are root tasks in `turbo.json` (`//#lint`, `//#format`), not per-package scripts.

Each app has a `Dockerfile` that is built from the repository root (the build context is the whole monorepo) and uses `turbo prune` to install only what that app needs. `docker-compose.yml` at the root wires web to api through `API_URL`.

## CI and deployment

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`. It runs `pnpm format`, `pnpm lint`, `pnpm check-types` and `pnpm audit`, and builds both Docker images and pushes them to GHCR as `ghcr.io/momchilbg/memory-map-web` and `ghcr.io/momchilbg/memory-map-api`, tagged with the commit SHA (plus `latest` on `main`). An `e2e` job then starts those two images and a Postgres database as service containers and runs the Playwright tests inside Microsoft's Playwright container; keep the image tag in `ci.yml` equal to the `@playwright/test` version in `apps/e2e/package.json`. `pnpm audit` must stay clean, so fix or override vulnerable dependencies rather than ignoring them.

On `main`, only if the checks and the Playwright tests pass, CI deploys to Render by calling each service's deploy hook (repository secrets `RENDER_DEPLOY_HOOK_WEB` and `RENDER_DEPLOY_HOOK_API`) with the commit's image. Render does not build anything itself. `render.yaml` is the Blueprint: a `Memory-Map` web service and a `memory-map-api` service, both image-backed, free plan, Frankfurt. Web reaches the api through `API_URL`, set there to the api's public URL because free web services cannot receive private network traffic. The api's `DATABASE_URL` on Render is the Neon connection string, set in the Render dashboard (not stored in the repo).

## Workflow

- Work on a branch named after the issue, for example `2-add-linter-and-formatter`, and open a PR that closes the issue. Do not commit directly to `main`.
- Before finishing any change, run `pnpm exec turbo run lint format check-types` and fix whatever it reports.
- Always commit and push once the checks pass. Do not leave finished work uncommitted or wait to be asked.
- Keep the GitHub issues up to date as you work, for every ticket: assign the issue when you start, comment with the PR link and what is done or still left, use `Closes #N` only when the whole issue is covered (otherwise `Part of #N` and leave it open), and confirm the issue closed after the merge.

## Roadmap

Planned work, each tracked as an open issue: auth, storage, the map itself, Electron and offline mode, oRPC with react-query, zod and OpenAPI, shadcn components, a Render acceptance environment, dependabot, logging, error tracking, analytics and repo rules.
