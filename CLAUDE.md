# Memory Map

@AGENTS.md

## Project

Memory Map is an early-stage web app. The repository is a pnpm + Turborepo monorepo that so far contains only the scaffolding; features are tracked as GitHub issues on `MomchilBG/Memory-Map` (use the `gh` CLI to read them).

## Layout

- `apps/web` — the React Router v8 app (framework mode, Vite, Tailwind CSS v4). Next.js was removed in favour of React Router.
- `apps/api` — the NestJS 12 API (Fastify adapter, SWC builder, ESM, Vitest). Listens on `PORT`, default 3000. The web app reaches it from its server-side loaders through the `API_URL` environment variable, default `http://localhost:3000`. On Render it uses `API_HOSTPORT` instead.
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

- `pnpm dev` — start the dev servers.
- `pnpm build` — build all apps and packages.
- `pnpm lint` / `pnpm lint:fix` — run oxlint.
- `pnpm format` / `pnpm format:fix` — check or apply oxfmt formatting.
- `pnpm check-types` — type-check every package.
- `pnpm --filter api test` / `pnpm --filter api test:e2e` — run the API tests.
- `docker compose up --build` — build and run the production images; web is on http://localhost:8080 and api on http://localhost:3000.
- `pnpm exec turbo run lint format check-types` — all checks in one go.

Lint and format are root tasks in `turbo.json` (`//#lint`, `//#format`), not per-package scripts.

Each app has a `Dockerfile` that is built from the repository root (the build context is the whole monorepo) and uses `turbo prune` to install only what that app needs. `docker-compose.yml` at the root wires web to api through `API_URL`.

## Deployment

Render deploys on every commit to `main`. `render.yaml` at the root is the Blueprint: a `Memory-Map` web service (the React Router app) and a `memory-map-api` web service, both Node, free plan, Frankfurt. Neither sets a root directory, because the pnpm workspace and lockfile are at the repository root. Web reaches the api over Render's private network through `API_HOSTPORT`.

## Workflow

- Work on a branch named after the issue, for example `2-add-linter-and-formatter`, and open a PR that closes the issue. Do not commit directly to `main`.
- Before finishing any change, run `pnpm exec turbo run lint format check-types` and fix whatever it reports.
- Always commit and push once the checks pass. Do not leave finished work uncommitted or wait to be asked.
- Keep the GitHub issues up to date as you work, for every ticket: assign the issue when you start, comment with the PR link and what is done or still left, use `Closes #N` only when the whole issue is covered (otherwise `Part of #N` and leave it open), and confirm the issue closed after the merge.

## Roadmap

Planned work, each tracked as an open issue: database, auth, storage, the map itself, Electron and offline mode, oRPC with react-query, zod and OpenAPI, shadcn components, CI, E2E tests, a Render acceptance environment, dependabot, logging, error tracking, analytics and repo rules.
